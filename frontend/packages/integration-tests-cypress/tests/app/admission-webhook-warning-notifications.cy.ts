import { checkErrors, testName } from '../../support';
import { detailsPage } from '../../views/details-page';
import * as yamlEditor from '../../views/yaml-editor';

const POD_NAME = `pod1`;
const CONTAINER_NAME = `container1`;
const podToDisplayWarning = `apiVersion: v1
kind: Pod
metadata:
  name: ${POD_NAME}
  labels:
    app: httpd
  namespace: default
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name:  ${CONTAINER_NAME}
      image: 'image-registry.openshift-image-registry.svc:5000/openshift/httpd:latest'
      ports:
        - containerPort: 8080
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL`;
const warning =
  'Pod example violates policy 299 - "[pod-must-have-label-foo] you must provide labels: {"foo"}"';

describe('Admission Webhook Warning', () => {
  before(() => {
    cy.login();
    cy.createProjectWithCLI(testName);
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    cy.visit('/');
    cy.deleteProjectWithCLI(testName);
  });

  it('Create pod and display warning policy notifications', () => {
    cy.visit(`/k8s/ns/${testName}/import`);
    yamlEditor.isImportLoaded();
    yamlEditor.setEditorContent(podToDisplayWarning).then(() => {
      cy.intercept('POST', '/api/kubernetes/api/v1/namespaces/default/pods', {
        fixture: 'pod1.json',
        headers: {
          Warning: warning,
          // 'Pod example violates policy 299 - "[pod-must-have-label-foo] you must provide labels: {"foo"}"',
        },
      })
        .as('matchedUrl')
        .as('users');
      yamlEditor.clickSaveCreateButton();
      // Pod example violates policy 299 - "[pod-must-have-label-foo] you must provide labels: {\"foo\"}"
      // Verify the ...
      cy.byTestID('admission-webhook-warning-learn-more')
        .parents()
        .contains('Admission Webhook Warning');
      cy.byTestID('admission-webhook-warning-learn-more').parents().contains(warning);
      cy.byTestID('admission-webhook-warning-learn-more').contains('Learn more');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(2000);
      detailsPage.sectionHeaderShouldExist('Pod details');
    });
  });
});
