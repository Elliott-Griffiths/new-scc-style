// --- VARIABLES ------------------------------------------------------------ \\

fieldsToCheckBeforeClose.push(
    ...[
      "sel_application_status",
      "txt_complaint_received",
      "sel_portfolio",
      "mchk_complaint_category",
      "txt_investigating_manager",
      "txt_address_investigating_manager",
      "txt_accountable_manager",
      "txt_address_accountable_manager",
      "txt_complaint_acknowledgement",
      "sel_outcome_complaint",
      "sel_agreed_remedies",
      "rad_financial_remedies",
    ]
  );
  
  // --- FORM LOAD ------------------------------------------------------------ \\
  
  handleInitialisingEvent();
  
  // --- FORM READY ----------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_ready")
    .on("_KDF_ready", function (event, kdf) {
      handleOnReadyEvent(event, kdf);
      logArguments(event, kdf);
  
      //-----------------------------Add case note to employee desktop in events----------------------------------------------------------//
  
      $("#dform_widget_button_but_add_case_note").on("click", function () {
        if (
          KDF.getVal("sel_case_note_type") !== "" &&
          KDF.getVal("txta_progress_update") !== ""
        ) {
          KDF.customdata("add-case-note", this.id, true, true, {
            caseNote: `Note type: ${KDF.getVal(
              "sel_case_note_type"
            )} - ${KDF.getVal("txta_progress_update")}`,
          });
        }
      });
  
      // --------------------- Function to calculate SLA target date based on complaint received date (15 days) ------------------------ //
  
      async function isNonWorkingDay(date) {
        return isWeekend(date) || (await isUKBankHoliday(date));
      }
  
      async function addDaysToDate(date, daysToAdd, considerWorkingDays = false) {
        const newDate = new Date(date);
  
        if (!considerWorkingDays) {
          newDate.setDate(newDate.getDate() + daysToAdd);
          return newDate;
        }
  
        // Considering working days
        let remainingDaysToAdd = daysToAdd;
        while (remainingDaysToAdd > 0) {
          newDate.setDate(newDate.getDate() + 1);
          if (!(await isNonWorkingDay(newDate))) {
            remainingDaysToAdd--;
          }
        }
        return newDate;
      }
  
      // Calculate SLA target date
      async function calculateSlaTargetDate(
        complaintPrefix,
        slaPrefix,
        baseDaysToAdd = 15
      ) {
        const dd = parseInt($(`#${complaintPrefix}_dd`).val(), 10);
        const mm = parseInt($(`#${complaintPrefix}_mm`).val(), 10);
        const yy = parseInt($(`#${complaintPrefix}_yy`).val(), 10);
  
        // Check if customer agreed to an extension
        const customerAgreedExtension = $(
          `input[name="rad_customer_agreed_extension"]:checked`
        ).val();
        const extraDays = customerAgreedExtension === "Yes" ? 10 : 0;
        const totalDaysToAdd = baseDaysToAdd + extraDays;
  
        // Validate day, month, and year
        if (!isNaN(dd) && !isNaN(mm) && !isNaN(yy)) {
          const complaintReceivedDate = new Date(yy, mm - 1, dd);
  
          // Calculate the SLA target date using the generalized function
          const slaTargetDate = await addDaysToDate(
            complaintReceivedDate,
            totalDaysToAdd,
            true // Pass `true` to consider working days
          );
  
          // Extract and format the day, month, and year of the calculated SLA date
          const slaDay = String(slaTargetDate.getDate()).padStart(2, "0");
          const slaMonth = String(slaTargetDate.getMonth() + 1).padStart(2, "0");
          const slaYear = slaTargetDate.getFullYear();
  
          // Set the calculated SLA date in the target SLA fields
          $(`#${slaPrefix}_dd`).val(slaDay);
          $(`#${slaPrefix}_mm`).val(slaMonth);
          $(`#${slaPrefix}_yy`).val(slaYear);
  
          // Trigger focusout to indicate fields are filled
          $(`#${slaPrefix}_dd`).focusout();
          $(`#${slaPrefix}_mm`).focusout();
          $(`#${slaPrefix}_yy`).focusout();
        }
      }
  
      // Event listener to calculate SLA target date based on input changes
      $(
        "#dform_widget_num_complaint_accepted_dd, #dform_widget_num_complaint_accepted_mm, #dform_widget_num_complaint_accepted_yy, input[name='rad_customer_agreed_extension']"
      ).on("change", function () {
        calculateSlaTargetDate(
          "dform_widget_num_complaint_accepted",
          "dform_widget_num_sla_target"
        );
      });
  
      //---------------------------- Functions for Portfolio lookups found in Forms Adapter ------------------------------//
  
      if (kdf.form && kdf.form.ref) {
        KDF.setVal("sel_service", kdf.form.data.sel_service);
  
        if (kdf.form.data.sel_team && kdf.form.data.sel_team !== "") {
          console.log("kdf.form.data.sel_team", kdf.form.data.sel_team);
          KDF.setVal("sel_team", kdf.form.data.sel_team);
        }
  
        let portfolioVal = KDF.getVal("sel_portfolio");
        let serviceVal = kdf.form.data.sel_service;
  
        if (portfolioVal) {
          KDF.custom(
            "comp_portfolio_sa_lookup",
            "_sel_portfolio",
            "sel_portfolio",
            "sel_portfolio",
            true,
            true,
            true
          );
  
          if (!serviceVal) {
            KDF.custom(
              "comp_portfolio_sa_router",
              "_sel_service",
              "sel_portfolio",
              "sel_portfolio",
              true,
              true,
              true
            );
          }
        }
      }
  
      $(document).ready(function () {
        // Set to allow DOM load
        let blockServiceChange = true;
  
        $("#dform_widget_sel_portfolio")
          .off("change")
          .on("change", function () {
            let newVal = $(this).val();
            KDF.setVal("sel_portfolio", newVal);
            KDF.custom(
              "comp_portfolio_sa_lookup",
              "_sel_portfolio",
              "sel_portfolio",
              "sel_portfolio",
              true,
              true,
              true
            );
          });
  
        $("#dform_widget_sel_service")
          .off("change")
          .on("change", function () {
            if (blockServiceChange) {
              return;
            }
  
            let newServiceVal = $(this).val();
            KDF.setVal("sel_service", newServiceVal);
            KDF.custom(
              "comp_portfolio_sa_router",
              "_sel_service",
              "sel_portfolio,sel_service",
              "sel_portfolio,sel_service",
              true,
              true,
              true
            );
          });
        setTimeout(() => {
          blockServiceChange = false;
        }, 300);
      });
  
      // ---------------------------------------- Hide Early Resolution (rad_reason_complaint) if over 5 days -----------------------------------//
  
      function checkComplaintDate() {
        const day = parseInt(
          $("#dform_widget_num_complaint_accepted_dd").val(),
          10
        );
        const month =
          parseInt($("#dform_widget_num_complaint_accepted_mm").val(), 10) - 1;
        const year = parseInt(
          $("#dform_widget_num_complaint_accepted_yy").val(),
          10
        );
  
        // Create a new Date object for the complaint received date
        const complaintAcceptedDate = new Date(year, month, day);
  
        // Get today's date
        const today = new Date();
  
        // Calculate the difference in time between today and the complaint received date
        const timeDifference = today - complaintAcceptedDate;
        const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);
  
        // Check if the complaint received date is more than 5 days ago
        if (differenceInDays > 5) {
          KDF.setVal("rad_reason_complaint", "Investigation stage");
          console.log("rad_reason_complaint set to: Investigation stage");
          KDF.hideWidget("rad_reason_complaint");
          KDF.hideWidget("chk_early_resolution");
        } else {
          KDF.setVal("rad_reason_complaint", "");
          KDF.showWidget("rad_reason_complaint");
          console.log("rad_reason_complaint reset to empty");
        }
      }
  
      // Event listener
      $(
        "#dform_widget_num_complaint_accepted_dd, #dform_widget_num_complaint_accepted_mm, #dform_widget_num_complaint_accepted_yy"
      ).on("change", checkComplaintDate);
  
      //------------------------------- Open email body to managers ----------------------------------------//
  
      // Click event for sending email to the accountable manager
      $("#dform_widget_button_but_info_required").on("click", function () {
        const caseUrl = `${window.location.ancestorOrigins[0]}/work/item/${kdf.form.caseid}`;
  
        // Open email for the investigating manager
        window.open(
          "mailto:" +
            KDF.getVal("txt_address_investigating_manager") +
            "?subject=A%20complaint%20has%20been%20received%20for%20your%20service%20area" +
            "&body=Dear%20%0A%0A" +
            "A%20complaint%20has%20been%20received%20for%20your%20service%20area.%0A%0A" +
            "So%20we%20can%20assign%20the%20complaint%20to%20the%20appropriate%20place%2C%20please%20let%20us%20know%20who%20the%20investigating%20manager%20will%20be.%0A%0A" +
            "Kind%20Regards%2C%0A%0A" +
            "Customer%20Feedback%20and%20Complaints%20Team%0A" +
            "Resources%2C%20Sheffield%20City%20Council%0A" +
            "Floor%202%2C%20Howden%20House%2C%201%20Union%20Street%2C%20Sheffield%2C%20S1%202SH%0A" +
            "Contact%20Number%3A%200114%202734660%0A" +
            "Email%3A%20complaintadmin%40sheffield.gov.uk%0A%0A" +
            "Details%20of%20the%20complaint%20can%20be%20accessed%20by%20using%20the%20link%20below%3A%0A%0A" +
            caseUrl
        );
      });
  
      // Click event for sending email to the investigating manager
      $("#dform_widget_button_but_email_managers").on("click", function () {
        const caseUrl = `${window.location.ancestorOrigins[0]}/work/item/${kdf.form.caseid}`;
  
        // Open email for the investigating manager
        window.open(
          "mailto:" +
            KDF.getVal("txt_address_investigating_manager") +
            "?subject=A%20complaint%20has%20been%20assigned%20to%20you" +
            "&body=Dear%20" +
            KDF.getVal("txt_investigating_manager") +
            "%2C%0A%0AA%20complaint%20has%20been%20assigned%20to%20you.%0A%0A" +
            "Please%20find%20details%20of%20the%20complaint%20using%20the%20link%20below.%0A%0A" +
            "It%20is%20important%20that%20you%20keep%20this%20email%20link%20as%20you%20will%20need%20it%20to%20update%20the%20complaint.%0A%0A" +
            "Kind%20Regards%0ACustomer%20Feedback%20and%20Complaints%20Team%0AResources%2C%20Sheffield%20City%20Council%0AFloor%202%2C%20Howden%20House%2C%201%20Union%20Street%2C%20Sheffield%2C%20S1%202SH%0A" +
            "Contact%20Number%3A%200114%202734660%0AEmail%3A%20complaintadmin%40sheffield.gov.uk%0A%0A" +
            "Details%20of%20the%20complaint%20can%20be%20accessed%20by%20using%20the%20link%20below%3A%0A%0A" +
            caseUrl
        );
      });
  
    //   // Click event for sending email to the accountable manager
    //   $("#dform_widget_button_but_info_required").on("click", function () {
    //     const caseUrl = `${window.location.ancestorOrigins[0]}/work/item/${kdf.form.caseid}`;
  
    //     // Open email for the investigating manager
    //     window.open(
    //       "mailto:" +
    //         KDF.getVal("txt_address_investigating_manager") +
    //         "?subject=A%20complaint%20has%20been%20received%20for%20your%20service%20area" +
    //         "&body=Dear%20%0A%0A" +
    //         "A%20complaint%20has%20been%20received%20for%20your%20service%20area.%0A%0A" +
    //         "So%20we%20can%20assign%20the%20complaint%20to%20the%20appropriate%20place%2C%20please%20let%20us%20know%20who%20the%20investigating%20manager%20will%20be.%0A%0A" +
    //         "Kind%20Regards%2C%0A%0A" +
    //         "Customer%20Feedback%20and%20Complaints%20Team%0A" +
    //         "Resources%2C%20Sheffield%20City%20Council%0A" +
    //         "Floor%202%2C%20Howden%20House%2C%201%20Union%20Street%2C%20Sheffield%2C%20S1%202SH%0A" +
    //         "Contact%20Number%3A%200114%202734660%0A" +
    //         "Email%3A%20complaintadmin%40sheffield.gov.uk%0A%0A" +
    //         "Details%20of%20the%20complaint%20can%20be%20accessed%20by%20using%20the%20link%20below%3A%0A%0A" +
    //         caseUrl
    //     );
    //   });
  
      $("#dform_widget_button_but_send_email_managers").on("click", function () {
        if (
          KDF.getVal("txt_accountable_manager") &&
          KDF.getVal("txt_address_accountable_manager")
        ) {
          KDF.customdata("send-email-complaints-managers", this.id, true, true, {
            investigatingManager: KDF.getVal("txt_investigating_manager"),
            investigatingManagerEmail: KDF.getVal(
              "txt_address_investigating_manager"
            ),
            accountableManager: KDF.getVal("txt_accountable_manager"),
            accountableManagerEmail: KDF.getVal(
              "txt_address_accountable_manager"
            ),
          });
        } else {
          KDF.showError("Enter the managers infomation");
        }
      });
    });
  
  // --- PAGE CHANGES --------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_pageChange")
    .on("_KDF_pageChange", function (event, kdf, currentpageid, targetpageid) {
      handlePageChangeEvent(event, kdf, currentpageid, targetpageid);
    });
  
  // --- FIELD CHANGES -------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_fieldChange")
    .on("_KDF_fieldChange", function (event, kdf, field) {
      handleFieldChangeEvent(event, kdf, field);
    });
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_optionSelected")
    .on("_KDF_optionSelected", function (event, kdf, field, label, val) {
      handleOptionSelectedEvent(event, kdf, field, label, val);
  
      // Show widget if "Yes" is selected for consent on behalf of someone else (Page 3: Case Information)
  
      if (field === "rad_complaint_on_behalf") {
        KDF.hideWidget("sel_obtain_consent");
        KDF.hideWidget("ahtm_example_date_consent_given");
  
        if (val === "Yes") {
          KDF.showWidget("sel_obtain_consent");
        }
      }
  
      // Show date widget if "Consent given" is selected for able to obtain consent (Page 3: Case Information)
  
      if (field === "sel_obtain_consent") {
        KDF.hideWidget("ahtm_example_date_consent_given");
  
        if (val === "Consent given") {
          KDF.showWidget("ahtm_example_date_consent_given");
        }
      }
  
      // ------------------------- Show txt box if an extension is required (Page 3 Case information) ----------------------//
  
      if (field === "rad_customer_agreed_extension") {
        KDF.hideWidget("txta_info_complaint_extension");
        if (val === "Yes") {
          KDF.showWidget("txta_info_complaint_extension");
        }
      }
  
      // Show date widget for if the complaint was accepted or rejected (Page 4: Complaint acceptance)
  
      if (field === "rad_accept_reject") {
        KDF.hideWidget("ahtm_example_date_complaint_accepted");
        KDF.hideWidget("ahtm_example_date_complaint_rejected");
        KDF.hideWidget("sel_rejected_complaint");
        KDF.hideWidget("txta_rejecting_ownership");
        KDF.hideWidget("ahtm_example_date_sla_target");
        KDF.hideWidget("rad_complaint_on_behalf");
        KDF.hideWidget("rad_customer_agreed_extension");
        KDF.hideWidget("ahtm_date_customer_informed");
        KDF.hideWidget("rad_alternative_process");
        KDF.hideWidget("txt_internal_reference_number");
  
        if (val === "Accepted complaint") {
          KDF.showWidget("ahtm_example_date_complaint_accepted");
          KDF.showWidget("ahtm_example_date_sla_target");
          KDF.showWidget("rad_complaint_on_behalf");
          KDF.showWidget("rad_customer_agreed_extension");
          addDefaultFieldsToCheckBeforeClose();
          return;
        } else if (val === "Rejected complaint") {
          KDF.showWidget("ahtm_example_date_complaint_rejected");
          KDF.showWidget("sel_rejected_complaint");
          KDF.showWidget("txta_rejecting_ownership");
          KDF.showWidget("ahtm_date_customer_informed");
          KDF.showWidget("rad_alternative_process");
          KDF.showWidget("txt_internal_reference_number");
          updateFieldsToCheckBeforeClose();
        }
  
        return;
      }
  
      // Show multicheckbox based on reason for complaint selected (Page 7: Reason for complaint)
  
      (function () {
        function updateDiscriminationWidget() {
          let selectedComplaintValues = $(
            'input[name="mchk_complaint_category[]"]:checked'
          )
            .map(function () {
              return $(this).val();
            })
            .get();
  
          let equalityValues = $(
            'input[name="mchk_equality_diversity[]"]:checked'
          )
            .map(function () {
              return $(this).val();
            })
            .get();
  
          let conductValues = $('input[name="mchk_staff_conduct[]"]:checked')
            .map(function () {
              return $(this).val();
            })
            .get();
  
          KDF.hideWidget("mchk_accessibility");
          KDF.hideSection("area_accessibility");
          KDF.hideWidget("mchk_policy_legislation");
          KDF.hideSection("area_policy_legislation");
          KDF.hideWidget("mchk_staff_conduct");
          KDF.hideSection("area_staff_conduct");
          KDF.hideWidget("mchk_equality_diversity");
          KDF.hideSection("area_equality_diversity");
          KDF.hideWidget("mchk_delay");
          KDF.hideSection("area_delay");
          KDF.hideWidget("mchk_failure_refusal");
          KDF.hideSection("area_failure_refusal");
          KDF.hideWidget("mchk_quality");
          KDF.hideSection("area_quality");
          KDF.hideWidget("mchk_discrimination");
          KDF.hideSection("area_discrimination");
  
          // Show widgets based on complaint categories
          selectedComplaintValues.forEach(function (val) {
            switch (val) {
              case "Accessibility":
                KDF.showWidget("mchk_accessibility");
                KDF.showSection("area_accessibility");
                break;
              case "Policy and legislation":
                KDF.showWidget("mchk_policy_legislation");
                KDF.showSection("area_policy_legislation");
                break;
              case "Staff conduct":
                KDF.showWidget("mchk_staff_conduct");
                KDF.showSection("area_staff_conduct");
                break;
              case "Equality or diversity issues":
                KDF.showWidget("mchk_equality_diversity");
                KDF.showSection("area_equality_diversity");
                break;
              case "Delay":
                KDF.showWidget("mchk_delay");
                KDF.showSection("area_delay");
                break;
              case "Failure or refusal":
                KDF.showWidget("mchk_failure_refusal");
                KDF.showSection("area_failure_refusal");
                break;
              case "Quality":
                KDF.showWidget("mchk_quality");
                KDF.showSection("area_quality");
                break;
              case "Discrimination": // Check for "Discrimination" in complaint category
                KDF.showWidget("mchk_discrimination");
                KDF.showSection("area_discrimination");
                break;
              default:
                break;
            }
          });
  
          if (
            equalityValues.includes("Discrimination") ||
            equalityValues.includes("Harassment") ||
            equalityValues.includes("Victimisation") ||
            conductValues.includes("Discriminatory behaviour")
          ) {
            KDF.showWidget("mchk_discrimination");
            KDF.showSection("area_discrimination");
          }
        }
  
        // Event handlers to trigger the function when any relevant checkbox changes
        $("input[name='mchk_complaint_category[]']").change(
          updateDiscriminationWidget
        );
        $("input[name='mchk_equality_diversity[]']").change(
          updateDiscriminationWidget
        );
        $("input[name='mchk_staff_conduct[]']").change(
          updateDiscriminationWidget
        );
  
        // Call the function immediately to handle the initial state
        updateDiscriminationWidget();
      })();
  
      //Prefill widgets if value is true for early resoution (Page 6: Assinged to)
  
      if (field === "chk_early_resolution") {
        if (val === "true") {
          // Directly set 'Early resolution' in all fields
          KDF.setVal("txt_investigating_manager", "Early resolution");
          KDF.setVal("txt_address_investigating_manager", "Early resolution");
          KDF.setVal("txt_accountable_manager", "Early resolution");
          KDF.setVal("txt_address_accountable_manager", "Early resolution");
          KDF.hideWidget("txt_investigating_manager");
          KDF.hideWidget("txt_address_investigating_manager");
          KDF.hideWidget("txt_accountable_manager");
          KDF.hideWidget("txt_address_accountable_manager");
        } else {
          // Clear the four widgets when checkbox is unchecked
          KDF.setVal("txt_investigating_manager", "");
          KDF.setVal("txt_address_investigating_manager", "");
          KDF.setVal("txt_accountable_manager", "");
          KDF.setVal("txt_address_accountable_manager", "");
          KDF.showWidget("txt_investigating_manager");
          KDF.showWidget("txt_address_investigating_manager");
          KDF.showWidget("txt_accountable_manager");
          KDF.showWidget("txt_address_accountable_manager");
        }
      }
  
      // Show widgets for all remedy selections except no remedy required  (Page 9: Remedies)
  
      if (field === "sel_agreed_remedy_1") {
        KDF.hideWidget("txt_action_owner");
        KDF.hideWidget("eml_address_action_owner");
        KDF.hideWidget("ahtm_example_date_action_due");
        KDF.hideWidget("txta_area_learning");
  
        // Show all widgets if the selected value is not "No remedy required"
        if (val !== "No remedy required") {
          KDF.showWidget("txt_action_owner");
          KDF.showWidget("eml_address_action_owner");
          KDF.showWidget("ahtm_example_date_action_due");
          KDF.showWidget("txta_area_learning");
        }
      }
  
      // Handle multiple agreed remedies based on the number selected (Page 10: Remedies and service improvements)
  
      if (field === "sel_agreed_remedies") {
        for (let i = 1; i <= 5; i++) {
          KDF.hideWidget("sel_agreed_remedy_" + i);
          $('select[name="sel_agreed_remedy_' + i + '"]').prop(
            "selectedIndex",
            0
          );
  
          // Hide any other related widgets for each remedy
          KDF.hideWidget(`txt_action_owner_${i}`);
          KDF.hideWidget(`eml_address_action_owner_${i}`);
          KDF.hideWidget(`ahtm_example_date_action_due_${i}`);
          KDF.hideWidget(`txta_area_learning_${i}`);
        }
  
        // Show the necessary number of agreed remedy widgets based on val selected
        const numToShow = parseInt(val);
        for (let i = 1; i <= numToShow; i++) {
          KDF.showWidget("sel_agreed_remedy_" + i);
          KDF.showWidget("txt_action_due_" + i);
        }
      }
  
      // Show widgets for agreed remedies once a value is selected (Page 10: Remedies and service improvements)
  
      function handleSelection(field, val) {
        if (field.startsWith("sel_agreed_remedy_")) {
          const index = field.split("_").pop();
  
          KDF.hideWidget(`txt_action_owner_${index}`);
          KDF.hideWidget(`eml_address_action_owner_${index}`);
          KDF.hideWidget(`ahtm_example_date_action_due_${index}`);
          KDF.hideWidget(`txta_area_learning_${index}`);
  
          if (val && val !== "No remedy required") {
            KDF.showWidget(`txt_action_owner_${index}`);
            KDF.showWidget(`eml_address_action_owner_${index}`);
            KDF.showWidget(`ahtm_example_date_action_due_${index}`);
            KDF.showWidget(`txta_area_learning_${index}`);
          }
        }
      }
  
      handleSelection(field, val);
  
      // Show widgets if value is "Yes" for financial remedies  (Page 11: Financial remedies)
  
      if (field === "rad_financial_remedies") {
        KDF.hideWidget("ahtm_example_date_payment_recieved");
        KDF.hideWidget("sel_payment_type");
        KDF.hideWidget("num_amount_payment");
        KDF.hideWidget("mchk_reason_payment");
        KDF.hideWidget("txta_reason_payment");
  
        // Show all widgets if the selected value is not "No"
        if (val !== "No") {
          KDF.showWidget("ahtm_example_date_payment_recieved");
          KDF.showWidget("sel_payment_type");
          KDF.showWidget("num_amount_payment");
          KDF.showWidget("mchk_reason_payment");
          KDF.showWidget("txta_reason_payment");
        }
      }
  
      // --------------------------- Recheck fields before Closure ---------------------- //
  
      if (field === "rad_accept_reject" || field === "rad_reason_complaint") {
        updateFieldsToCheckBeforeClose();
      }
  
      // -------------------------- Reapply values for service area on click --------------- //
  
      //   $("#edit_button_page_service_area").on("click", function () {
      //     if (kdf.form && kdf.form.ref) {
      //       KDF.setVal("sel_service", "");
      //       KDF.setVal("sel_service", kdf.form.data.sel_service);
      //       $("#dform_widget_sel_service").trigger("change");
      //       setTimeout(() => {
      //         console.log('edit_button_page_service_area', kdf.form.data.sel_team)
      //         KDF.setVal("sel_team", kdf.form.data.sel_team);
      //       }, 100);
      //     }
      // });
  
      // ------------------------ Added in error (override everything) ------------------------ //
  
      if (field === "rad_added_in_error") {
        if (val === "Yes") {
          errorFieldsToCheckBeforeClose();
          return;
        } else if (val === "No") {
          addDefaultFieldsToCheckBeforeClose();
          return;
        }
      }
  
      // -------------------------- Early resolution fields for closure ---------------- //
  
      if (field === "rad_reason_complaint") {
        const outcomeVal = KDF.getVal("sel_outcome_complaint");
  
        if (val === "Early resolution") {
          addBasicFieldsToCheckBeforeClose();
          return;
        } else if (val === "Investigation stage" && outcomeVal === "Withdrawn") {
          addBasicFieldsToCheckBeforeClose();
          return;
        } else {
          addDefaultFieldsToCheckBeforeClose();
          return;
        }
      }
  
      // ------------------------ Withdrawn ------------------------ //
  
      if (field === "sel_outcome_complaint") {
        const reasonVal = KDF.getVal("rad_reason_complaint");
  
        // Don't override if already Early resolution
        if (reasonVal === "Early resolution") {
          return;
        }
  
        if (val === "Withdrawn") {
          addBasicFieldsToCheckBeforeClose();
          return;
        } else {
          addDefaultFieldsToCheckBeforeClose();
          return;
        }
      }
    });
  
  // --- OBJECT --------------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_objectidSet")
    .on("_KDF_objectidSet", function (event, kdf, type, id) {
      handleObjectIdSet(event, kdf, type, id);
    });
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_objectdataLoaded")
    .on("_KDF_objectdataLoaded", function (event, kdf, response, type, id) {
      handleObjectIdLoaded(event, kdf, response, type, id);
    });
  
  // --- CUSTOM ACTIONS ------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_custom")
    .on("_KDF_custom", function (event, kdf, response, action, actionedby) {
      handleSuccessfulAction(event, kdf, response, action, actionedby);
      logArguments(event, kdf, response, action, actionedby);
  
      if (action === "send-email-complaints-managers") {
        KDF.gotoPage("page_review", false, true, true);
      }
    });
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_customError")
    .on(
      "_KDF_customError",
      function (event, customaction, xhr, settings, thrownError) {
        handleFailedAction(event, customaction, xhr, settings, thrownError);
      }
    );
  
  // --- SAVE FORM ------------------------------------------------------------ \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_save")
    .on("_KDF_save", function (event, kdf) {
      handleFormSave(event, kdf);
    });
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_saveError")
    .on("_KDF_saveError", function (event, kdf) {
      handleFailedSave();
    });
  
  // --- COMPLETE FORM -------------------------------------------------------- \\
  
  $("#dform_cm_complaint_investigate")
    .off("_KDF_complete")
    .on("_KDF_complete", function (event, kdf) {
      handleFomComplate(event, kdf);
  
      closeCase();
    });
  
  // ----------- Default Fields to Check before closure -------------- //
  
  function addDefaultFieldsToCheckBeforeClose() {
    fieldsToCheckBeforeClose.length = 0;
  
    const defaultFields = [
      "sel_application_status",
      "txt_complaint_received",
      "sel_portfolio",
      "mchk_complaint_category",
      "txt_investigating_manager",
      "txt_address_investigating_manager",
      "txt_accountable_manager",
      "txt_address_accountable_manager",
      "txt_complaint_acknowledgement",
      "sel_outcome_complaint",
      "sel_agreed_remedies",
      "rad_financial_remedies",
    ];
  
    fieldsToCheckBeforeClose.push(...defaultFields);
  }
  
  // ----------- Rejected function for fields before closure ---------------- //
  
  function updateFieldsToCheckBeforeClose() {
    fieldsToCheckBeforeClose.length = 0;
  
    fieldsToCheckBeforeClose.push(
      "sel_application_status",
      "txt_complaint_received"
    );
  }
  
  // ----------- Opened in error fields before closure ---------------- //
  
  function errorFieldsToCheckBeforeClose() {
    fieldsToCheckBeforeClose.length = 0;
  
    fieldsToCheckBeforeClose.push("rad_added_in_error");
  }
  
  //----------- Early Resolution fields before close ----------------- //
  
  function addBasicFieldsToCheckBeforeClose() {
    fieldsToCheckBeforeClose.length = 0;
  
    const basicFields = [
      "sel_application_status",
      "txt_complaint_received",
      "sel_portfolio",
      "mchk_complaint_category",
      "sel_outcome_complaint",
    ];
  
    fieldsToCheckBeforeClose.push(...basicFields);
  }
  