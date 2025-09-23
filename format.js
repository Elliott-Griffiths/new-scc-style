
// --- FORM LOAD ------------------------------------------------------------ \\

handleInitialisingEvent();

// --- FORM READY ----------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_ready')
  .on('_KDF_ready', function (event, kdf) {
    handleOnReadyEvent(event, kdf);
  });

// --- PAGE CHANGES --------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_pageChange')
  .on('_KDF_pageChange', function (event, kdf, currentpageid, targetpageid) {
    handlePageChangeEvent(event, kdf, currentpageid, targetpageid);
  });

// --- FIELD CHANGES -------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_fieldChange')
  .on('_KDF_fieldChange', function (event, kdf, field) {
    handleFieldChangeEvent(event, kdf, field);
  });

$('#dform_disrepair_private_rented')
  .off('_KDF_optionSelected')
  .on('_KDF_optionSelected', function (event, kdf, field, label, val) {
    handleOptionSelectedEvent(event, kdf, field, label, val);

    // ----------------- Handle Show widget and page is not tenant (Page 1) ------------------- //

    if (field === "rad_are_you_the_tenant") {
      KDF.hideWidget("rad_permission_to_report_this_problem_to_us");
      KDF.hidePage("page_About_the_tenant_2_of_2");
      KDF.hideWidget("sel_what_is_your_profession");
      KDF.hideWidget("ahtm_alert_tenants_permission");
      KDF.hideWidget("txt_other_profession");
      $('input[name="rad_permission_to_report_this_problem_to_us"]').prop('checked', false);
      KDF.setVal("sel_what_is_your_profession", "Please select...");

      if (val === "No") {
        KDF.showWidget("rad_permission_to_report_this_problem_to_us");
        KDF.showPage("page_About_the_tenant_2_of_2");
      }
    }

    // ----------------- Handle Show select or block for tenants permission (Page 1) ------------------- //

    if (field === "rad_permission_to_report_this_problem_to_us") {
      KDF.hideWidget("sel_what_is_your_profession");
      KDF.hideWidget("ahtm_alert_tenants_permission");
      KDF.hideWidget("txt_other_profession");

      if (val === "No") {
        KDF.showWidget("ahtm_alert_tenants_permission");
      } else if (val === "Yes") {
        KDF.showWidget("sel_what_is_your_profession");
      }
    }

    // ----------------- Handle show test box if other (Page 1) ------------------- //

    if (field === "sel_what_is_your_profession") {
      KDF.hideWidget("txt_other_profession");
      if (val === "Other") {
        KDF.showWidget("txt_other_profession");
      }
    }


    // ----------------- Show text field if type of property is other (Page 2) ----------------- //

    if (field === 'sel_type_of_property') {
      KDF.hideWidget('txt_other_property_type');
      KDF.setVal('txt_other_property_type', '');
      if (val === 'Other') {
        KDF.showWidget('txt_other_property_type');
      }
    }

    // ---------------- Handle visibility of occupant num fields based on selected type of occupant (Page 3) ------------ //

    if (field === 'sel_type_of_occupants_in_property') {
      KDF.hideWidget('num_of_adults_in_the_property');
      KDF.setVal('num_of_adults_in_the_property', '');
      KDF.hideWidget('num_of_children_in_the_property');
      KDF.setVal('num_of_children_in_the_property', '');

      if (val) {
        KDF.showWidget('num_of_adults_in_the_property');
        if (val === 'A family' || val === 'Shared occupants') {
          KDF.showWidget('num_of_children_in_the_property');
        }
      }
    }

    // ---------------- About the property (2 of 3) ------------ //    

    if (field === "rad_upload_gas_safety_certificate") {
      KDF.hideWidget("ahtm_file_gas_safety_certificate");
      KDF.hideWidget("file_optional_gas_safety_certificate_evidence");


      if (val === "Yes") {
        KDF.showWidget("ahtm_file_gas_safety_certificate");
        KDF.showWidget("file_optional_gas_safety_certificate_evidence");
      }
    }

    if (field === "rad_upload_electrical_safety_certificate") {
      KDF.hideWidget("ahtm_file_electrical_safety_certificate");
      KDF.hideWidget("file_optional_electrical_safety_certificate_evidence");


      if (val === "Yes") {
        KDF.showWidget("ahtm_file_electrical_safety_certificate");
        KDF.showWidget("file_optional_electrical_safety_certificate_evidence");
      }
    }

    // ---------------- About the property (3 of 3) ------------ //    

    if (field === "rad_smoke_detectors_alarms") {
      KDF.hideWidget("num_smoke_detectors_alarms");
      KDF.hideWidget("txta_location_of_smoke_detectors_alarms");


      if (val === "Yes") {
        KDF.showWidget("num_smoke_detectors_alarms");
        KDF.showWidget("txta_location_of_smoke_detectors_alarms");
      }
    }

    if (field === "rad_carbon_monoxide_detectors_alarms") {
      KDF.hideWidget("num_carbon_monoxide_detectors_alarms");
      KDF.hideWidget("txta_location_of_carbon_monoxide_detectors_alarms");


      if (val === "Yes") {
        KDF.showWidget("num_carbon_monoxide_detectors_alarms");
        KDF.showWidget("txta_location_of_carbon_monoxide_detectors_alarms");
      }
    }

    // ----------------- Handle long-term health conditions ----------------//

    if (field === 'sel_long_term_health_conditions') {
      const healthConditionsField = 'mchk_health_conditions';
      const lenOfHealthConditions = [1, 2, 3, 4, 5];
      const otherHealthConditionsField = 'txt_other_health_conditions';
      const wellbeingField = 'rad_property_condditions_effecting_wellbeing';

      if (val === 'Yes') {
        KDF.showWidget(healthConditionsField);
        KDF.showWidget(wellbeingField);
        return;
      }

      KDF.hideWidget(healthConditionsField);
      lenOfHealthConditions.map(i => {
        $(`#dform_widget_${healthConditionsField}${i}`).prop('checked', false);
      });
      KDF.hideWidget(otherHealthConditionsField);
      KDF.setVal(otherHealthConditionsField, '');
      KDF.hideWidget(wellbeingField);
      $(`input[name="${wellbeingField}"]`).prop('checked', false);
    }

    // ----------------- Handle multi-checkbox health conditions ----------------//

    if (field === 'mchk_health_conditions[]') {
      const healthConditionsField = 'mchk_health_conditions';
      const healthConditionsSelected = 'txt_health_conditions';
      const otherHealthConditionsField = 'txt_other_health_conditions';

      writeMultiCheckboxToTextField(healthConditionsField, healthConditionsSelected);
      if ($(`#dform_widget_${healthConditionsField}5`).is(':checked')) {
        KDF.showWidget(otherHealthConditionsField);
        return;
      }
      KDF.hideWidget(otherHealthConditionsField);
      KDF.setVal(otherHealthConditionsField, '');
    }

    // ----------------- Update property manager details dynamically ----------------//

    if (field === 'rad_who_do_you_go_though') {
      KDF.hideWidget('ahtm_contact_landlord');
      KDF.hideWidget('ahtm_contact_agent_manager');
      KDF.hideWidget('ahtm_notified_landlord');
      KDF.hideWidget('ahtm_notified_manager');

      $(`input[name="rad_have_you_notified_property_manager"]`).prop('checked', false);
      const notifiedField = 'rad_have_you_notified_property_manager';
      const noticePanelContainer = 'ahtm_contact_property_manager';
      const noticePanelTitle = 'property_manager_title';
      const noticePanelText = 'property_manager';
      const managerName = 'txt_property_manager_name';

      $(`[data-name="${notifiedField}"] legend`).text(`Has the ${val.toLowerCase()} been notified of the problem previously?`);
      $(`[data-name="${notifiedField}"] .dform_validationMessage`).text(`Select yes if the ${val.toLowerCase()} has been notified of the problem previously`);
      $(`[data-name="${managerName}"] label`).text(`Full name of the ${val.toLowerCase()}`);
      $(`[data-name="${managerName}"] .dform_validationMessage`).text(`Enter the full name of the ${val.toLowerCase()}`);
      $(`#${noticePanelTitle}`).text(`Inform your ${val.toLowerCase()}`);
      $(`#${noticePanelText}`).text(val.toLowerCase());
      KDF.showWidget(notifiedField);
    }

    // ----------------- Handle property manager notification ----------------//

    if (field === 'rad_have_you_notified_property_manager') {
      KDF.hideWidget('ahtm_contact_landlord');
      KDF.hideWidget('ahtm_contact_agent_manager');
      KDF.hideWidget('ahtm_notified_landlord');
      KDF.hideWidget('ahtm_notified_manager');

      if (val === 'No' && KDF.getVal('rad_who_do_you_go_though') === 'Landlord') {
        KDF.showWidget('ahtm_contact_landlord');
      } else if (val === 'No' && KDF.getVal('rad_who_do_you_go_though') === 'Agent/manager') {
        KDF.showWidget('ahtm_contact_agent_manager');
      } else if (val === 'Yes' && KDF.getVal('rad_who_do_you_go_though') === 'Agent/manager') {
        KDF.showWidget('ahtm_notified_manager');
      } else if (val === 'Yes' && KDF.getVal('rad_who_do_you_go_though') === 'Landlord') {
        KDF.showWidget('ahtm_notified_landlord');
      }
    }

    if (field === 'rad_have_copy_of_tenancy_agreement') {
      KDF.hideWidget('rad_can_send_copy_electronically');

      if (val === 'Yes') {
        KDF.showWidget('rad_can_send_copy_electronically');
      }
    }

  });

// --- OBJECT --------------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_objectidSet')
  .on('_KDF_objectidSet', function (event, kdf, type, id) {
    handleObjectIdSet(event, kdf, type, id);
  });

$('#dform_disrepair_private_rented')
  .off('_KDF_objectdataLoaded')
  .on('_KDF_objectdataLoaded', function (event, kdf, response, type, id) {
    handleObjectIdLoaded(event, kdf, response, type, id);
  });

// --- CUSTOM ACTIONS ------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_custom')
  .on('_KDF_custom', function (event, kdf, response, action, actionedby) {
    handleSuccessfulAction(event, kdf, response, action, actionedby);
  });

$('#dform_disrepair_private_rented')
  .off('_KDF_customError')
  .on('_KDF_customError', function (event, customaction, xhr, settings, thrownError) {
    handleFailedAction(event, customaction, xhr, settings, thrownError);
  });

// --- SAVE FORM ------------------------------------------------------------ \\

$('#dform_disrepair_private_rented')
  .off('_KDF_save')
  .on('_KDF_save', function (event, kdf) {
    handleFormSave(event, kdf);
  });

$('#dform_disrepair_private_rented')
  .off('_KDF_saveError')
  .on('_KDF_saveError', function (event, kdf) {
    handleFailedSave();
  });

// --- COMPLETE FORM -------------------------------------------------------- \\

$('#dform_disrepair_private_rented')
  .off('_KDF_complete')
  .on('_KDF_complete', function (event, kdf) {
    handleFomComplate(event, kdf);
  });
