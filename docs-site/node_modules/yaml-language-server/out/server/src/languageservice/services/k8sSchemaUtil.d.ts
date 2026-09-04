import { JSONDocument } from '../parser/jsonDocument';
import { SingleYAMLDocument } from '../parser/yamlParser07';
import { ResolvedSchema } from 'vscode-json-languageservice/lib/umd/services/jsonSchemaService';
/**
 * Attempt to retrieve the schema for a given YAML document based on the Kubernetes GroupVersionKind (GVK).
 *
 * First, checks for a schema for a matching builtin resource, then it checks for a schema for a CRD.
 *
 * @param doc the yaml document being validated
 * @param kubernetesSchema the resolved copy of the Kubernetes builtin
 * @param crdCatalogURI the catalog uri to use to find schemas for custom resource definitions
 * @returns a schema uri, or undefined if no specific schema can be identified
 */
export declare function autoDetectKubernetesSchema(doc: SingleYAMLDocument | JSONDocument, kubernetesSchema: ResolvedSchema, crdCatalogURI: string): string | undefined;
/**
 * Retrieve schema by auto-detecting the Kubernetes GroupVersionKind (GVK) from the document.
 * If there is no definition for the GVK in the main kubernetes schema,
 * the schema is then retrieved from the CRD catalog.
 * Public for testing purpose, not part of the API.
 * @param doc
 * @param crdCatalogURI The URL of the CRD catalog to retrieve the schema from
 */
export declare function autoDetectCustomResource(gvk: GroupVersionKind, crdCatalogURI: string): string | undefined;
type GroupVersionKind = {
    group: string;
    version: string;
    kind: string;
};
/**
 * Retrieve the group, version and kind from the document.
 * Public for testing purpose, not part of the API.
 * @param doc
 */
export declare function getGroupVersionKindFromDocument(doc: SingleYAMLDocument | JSONDocument): GroupVersionKind | undefined;
export {};
