import * as React from 'react';
import * as _ from 'lodash';
import { useFormikContext, FormikValues, useField } from 'formik';
import { FormGroup, TextInputTypes } from '@patternfly/react-core';
import { InputField } from '../../formik-fields';
import ApplicationDropdown from '../../dropdown/ApplicationDropdown';
import { getFieldId } from '../../formik-fields/field-utils';

export const CREATE_APPLICATION_KEY = '#CREATE_APPLICATION_KEY#';

export interface ApplicationSelectorProps {
  namespace?: string;
}

const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({ namespace }) => {
  const [isZeroApplication, setIsZeroApplication] = React.useState(false);
  const [selectedKey, { touched, error }] = useField('application.selectedKey');
  const { setFieldValue, setFieldTouched, validateForm } = useFormikContext<FormikValues>();
  const fieldId = getFieldId('application-name', 'dropdown');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  const onDropdownChange = (key: string, application: string) => {
    setFieldTouched('application.selectedKey', true);
    if (key === CREATE_APPLICATION_KEY) {
      setFieldValue('application.name', '');
      setFieldValue('application.selectedKey', key);
    } else {
      setFieldValue('application.name', application);
      setFieldValue('application.selectedKey', key);
    }
    validateForm();
  };

  const handleOnLoad = (items: { [key: string]: string }) => {
    const isEmptyItems = _.isEmpty(items);
    setIsZeroApplication(isEmptyItems);
    if (isEmptyItems) {
      setFieldValue('application.selectedKey', CREATE_APPLICATION_KEY);
      setFieldValue('application.name', '');
    }
  };

  return (
    <React.Fragment>
      {!isZeroApplication && (
        <FormGroup
          fieldId={fieldId}
          label="Application"
          helperTextInvalid={errorMessage}
          isValid={isValid}
        >
          <ApplicationDropdown
            dropDownClassName="dropdown--full-width"
            menuClassName="dropdown-menu--text-wrap"
            id={fieldId}
            namespace={namespace}
            actionItem={{
              actionTitle: 'Create Application',
              actionKey: CREATE_APPLICATION_KEY,
            }}
            autoSelect
            selectedKey={selectedKey.value}
            onChange={onDropdownChange}
            onLoad={handleOnLoad}
          />
        </FormGroup>
      )}
      {selectedKey.value === CREATE_APPLICATION_KEY && (
        <InputField
          type={TextInputTypes.text}
          name="application.name"
          label="Application Name"
          data-test-id="application-form-app-input"
          helpText="A unique name given to the application grouping to label your resources."
        />
      )}
    </React.Fragment>
  );
};

export default ApplicationSelector;
