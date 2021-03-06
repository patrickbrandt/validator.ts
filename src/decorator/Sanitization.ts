import {defaultMetadataStorage} from "../metadata/MetadataStorage";
import {SanitizeTypes} from "../types/SanitizeTypes";

/**
 * Options used to pass to sanitation decorators.
 */
export interface SanitizationOptions {

    /**
     * Specifies if validated value is an array and each of its item must be sanitized.
     */
    each?: boolean;

}

/**
 * Decorator used to register custom sanitizer.
 */
export function SanitizerConstraint() {
    return function(object: Function) {
        defaultMetadataStorage.addConstraintMetadata({
            sanitize: true,
            object: object
        });
    };
}

/**
 * Performs validation based on the given custom constraint.
 */
export function Sanitize(constraintClass: Function, annotationOptions?: SanitizationOptions) {
    return function(object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: SanitizeTypes.CUSTOM_SANITIZATION,
            sanitize: true,
            object: object,
            propertyName: propertyName,
            value1: constraintClass,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to
 * escape some chars, e.g @Blacklist('\\[\\]')
 */
export function Blacklist(chars: RegExp, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.BLACKLIST,
            object: object,
            propertyName: propertyName,
            value1: chars,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Replace <, >, &, ', " and / with HTML entities.
 */
export function Escape(annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.ESCAPE,
            object: object,
            propertyName: propertyName,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Trim characters from the left-side of the input.
 */
export function Ltrim(chars?: string[], annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.LTRIM,
            object: object,
            propertyName: propertyName,
            value1: chars,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Canonicalize an email address.
 */
export function NormalizeEmail(lowercase?: boolean, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.NORMALIZE_EMAIL,
            object: object,
            propertyName: propertyName,
            value1: lowercase,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Trim characters from the right-side of the input.
 */
export function Rtrim(chars?: string[], annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.RTRIM,
            object: object,
            propertyName: propertyName,
            value1: chars,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Remove characters with a numerical value < 32 and 127, mostly control characters.
 * If keepNewLines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
 * Unicode-safe in JavaScript.
 */
export function StripLow(keepNewLines?: boolean, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.STRIP_LOW,
            object: object,
            propertyName: propertyName,
            value1: keepNewLines,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Convert the input to a boolean.
 * Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
 */
export function ToBoolean(isStrict?: boolean, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_BOOLEAN,
            object: object,
            propertyName: propertyName,
            value1: isStrict,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Convert the input to a date, or null if the input is not a date.
 */
export function ToDate(annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_DATE,
            object: object,
            propertyName: propertyName,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Convert the input to a float.
 */
export function ToFloat(annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_FLOAT,
            object: object,
            propertyName: propertyName,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Convert the input to an integer, or NaN if the input is not an integer.
 */
export function ToInt(radix?: number, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_INT,
            object: object,
            propertyName: propertyName,
            value1: radix,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Convert the input to a string.
 */
export function ToString(annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_STRING,
            object: object,
            propertyName: propertyName,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.
 */
export function Trim(chars?: string[], annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TRIM,
            object: object,
            propertyName: propertyName,
            value1: chars,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Remove characters that do not appear in the whitelist.
 * The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]').
 */
export function Whitelist(chars: RegExp, annotationOptions?: SanitizationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.WHITELIST,
            object: object,
            propertyName: propertyName,
            value1: chars,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}