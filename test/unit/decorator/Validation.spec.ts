import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {defaultMetadataStorage} from "../../../src/metadata/MetadataStorage";
import {ValidatorConstraint, IsBooleanString} from "../../../src/decorator/Validation";
import {Validate} from "../../../src/decorator/Validation";
import {ValidationTypes} from "../../../src/types/ValidationTypes";
import {ValidatorInterface} from "../../../src/ValidatorInterface";
import {Contains} from "../../../src/decorator/Validation";
import {Equals} from "../../../src/decorator/Validation";
import {Validator} from "../../../src/Validator";
import {ValidationError} from "../../../src/ValidationError";
import {IsAfter} from "../../../src/decorator/Validation";
import {IsBefore} from "../../../src/decorator/Validation";
import {IsAlpha} from "../../../src/decorator/Validation";
import {IsAlphanumeric} from "../../../src/decorator/Validation";
import {IsAscii} from "../../../src/decorator/Validation";
import {IsBase64} from "../../../src/decorator/Validation";
import {IsBoolean} from "../../../src/decorator/Validation";
import {IsByteLength} from "../../../src/decorator/Validation";
import {IsCreditCard} from "../../../src/decorator/Validation";
import {IsCurrency} from "../../../src/decorator/Validation";
import {IsDate} from "../../../src/decorator/Validation";
import {IsDecimal} from "../../../src/decorator/Validation";
import {IsDivisibleBy} from "../../../src/decorator/Validation";
import {IsEmail} from "../../../src/decorator/Validation";
import {IsFQDN} from "../../../src/decorator/Validation";
import {IsFloat} from "../../../src/decorator/Validation";
import {IsFullWidth} from "../../../src/decorator/Validation";
import {IsHalfWidth} from "../../../src/decorator/Validation";
import {IsVariableWidth} from "../../../src/decorator/Validation";
import {IsHexColor} from "../../../src/decorator/Validation";
import {IsHexadecimal} from "../../../src/decorator/Validation";
import {IsIP} from "../../../src/decorator/Validation";
import {IsISBN} from "../../../src/decorator/Validation";
import {IsISO8601} from "../../../src/decorator/Validation";
import {IsIn} from "../../../src/decorator/Validation";
import {IsInt} from "../../../src/decorator/Validation";
import {IsJSON} from "../../../src/decorator/Validation";
import {IsLength} from "../../../src/decorator/Validation";
import {IsLowercase} from "../../../src/decorator/Validation";
import {IsMobilePhone} from "../../../src/decorator/Validation";
import {IsMongoId} from "../../../src/decorator/Validation";
import {IsMultibyte} from "../../../src/decorator/Validation";
import {IsNull} from "../../../src/decorator/Validation";
import {IsNumeric} from "../../../src/decorator/Validation";
import {IsSurrogatePair} from "../../../src/decorator/Validation";
import {IsUrl} from "../../../src/decorator/Validation";
import {IsUUID} from "../../../src/decorator/Validation";
import {IsUppercase} from "../../../src/decorator/Validation";
import {Matches} from "../../../src/decorator/Validation";
import {MinLength} from "../../../src/decorator/Validation";
import {MaxLength} from "../../../src/decorator/Validation";
import {MinNumber} from "../../../src/decorator/Validation";
import {MaxNumber} from "../../../src/decorator/Validation";
import {NotEmpty} from "../../../src/decorator/Validation";
import {NotEmptyArray} from "../../../src/decorator/Validation";
import {MinSize} from "../../../src/decorator/Validation";
import {MaxSize} from "../../../src/decorator/Validation";
import {ValidateNested} from "../../../src/decorator/Validation";

let validator: Validator;

function ifValid(object: any) {
    validator.validate(object).length.should.be.equal(0);
    validator.validateAsync(object).should.eventually.equal(object);
    expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
    validator.isValid(object).should.be.equal(true);
}

function ifNotValid(object: any) {
    validator.validate(object).length.should.be.equal(1);
    validator.validateAsync(object).should.eventually.be.rejected;
    expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
    validator.isValid(object).should.be.equal(false);
}

class TestClass {
    name: string;
}

class TestConstraint implements ValidatorInterface {
    validate(value: any): boolean {
        return !!value;
    }
}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

beforeEach(function() {
    validator = new Validator();
});

// -------------------------------------------------------------------------
// Specifications
// -------------------------------------------------------------------------

describe("ValidatorConstraint", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addConstraintMetadata");
        ValidatorConstraint()(TestClass);
        method.should.have.been.calledWith({
            sanitize: false,
            object: TestClass
        });
    }));

});

describe("Validate", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        Validate(TestConstraint)(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.CUSTOM_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            value1: TestConstraint,
            groups: undefined,
            message: undefined,
            always: undefined,
            each: undefined
        });
    }));

    it("should be able to set extra metadata options", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        Validate(TestConstraint, { always: true, each: true, message: "Error!", groups: ["main"] })(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.CUSTOM_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            value1: TestConstraint,
            groups: ["main"],
            message: "Error!",
            always: true,
            each: true
        });
    }));

});

describe("ValidateNested", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        ValidateNested()(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.NESTED_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            groups: undefined,
            message: undefined,
            always: undefined,
            each: undefined
        });
    }));

    it("should be able to set extra metadata options", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        ValidateNested({ always: true, each: true, message: "Error!", groups: ["main"] })(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.NESTED_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            groups: ["main"],
            message: "Error!",
            always: true,
            each: true
        });
    }));

});

describe("Contains", function() {

    class MyClass {
        @Contains("hello")
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hello world";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "bye world";
        ifNotValid(object);
    });

});

describe("Equals", function() {

    class MyClass {
        @Equals("Alex")
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "Alex";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "Alexxx";
        ifNotValid(object);
    });

});

describe("IsAfter", function() {

    class MyClass {
        @IsAfter(new Date(1995, 11, 17))
        date: Date;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = new Date();
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = new Date(1994, 11, 17);
        ifNotValid(object);
    });

});

describe("IsAlpha", function() {

    class MyClass {
        @IsAlpha()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomynameisalex";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hello1mynameisalex";
        ifNotValid(object);
    });

});

describe("IsAlphanumeric", function() {

    class MyClass {
        @IsAlphanumeric()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomyname1salex";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisalex";
        ifNotValid(object);
    });

});

describe("IsAscii", function() {

    class MyClass {
        @IsAscii()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomyname1salex";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisлеха";
        ifNotValid(object);
    });

});

describe("IsBase64", function() {

    class MyClass {
        @IsBase64()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "aGVsbG8=";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisalex";
        ifNotValid(object);
    });

});

describe("IsBefore", function() {

    class MyClass {
        @IsBefore(new Date(1995, 11, 17))
        date: Date;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = new Date(1994, 11, 17);
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = new Date();
        ifNotValid(object);
    });

});

describe("IsBooleanString", function() {

    class MyClass {
        @IsBooleanString()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "true";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "trui";
        ifNotValid(object);
    });

});

describe("IsBoolean", function() {

    class MyClass {
        @IsBoolean()
        name: any;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = true;
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "true";
        ifNotValid(object);
    });

});

describe("IsByteLength", function() {

    class MyClass {
        @IsByteLength(2, 20)
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellostring";
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "helloveryveryveryverylongstring";
        ifNotValid(object);
    });

});

describe("IsCreditCard", function() {

    class MyClass {
        @IsCreditCard()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "375556917985515"
            , "36050234196908"
            , "4716461583322103"
            , "4716-2210-5188-5662"
            , "4929 7226 5379 7141"
            , "5398228707871527"]
            .forEach(i => {
                object.name = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "foo"
            , "foo"
            , "5398228707871528"]
            .forEach(i => {
                object.name = i;
                ifNotValid(object);
            });
    });

});

describe("IsCurrency", function() {

    class MyClass {
        @IsCurrency()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "-$10,123.45"
            , "$10,123.45"
            , "$10123.45"
            , "10,123.45"
            , "10123.45"
            , "10,123"
            , "1,123,456"
            , "1123456"
            , "1.39"
            , ".03"
            , "0.10"
            , "$0.10"
            , "-$0.01"
            , "-$.99"
            , "$100,234,567.89"
            , "$10,123"
            , "10,123"
            , "-10123"]
            .forEach(i => {
                object.name = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "1.234"
            , "$1.1"
            , "$ 32.50"
            , "500$"
            , ".0001"
            , "$.001"
            , "$0.001"
            , "12,34.56"
            , "123456,123,123456"
            , "123,4"
            , ",123"
            , "$-,123"
            , "$"
            , "."
            , ","
            , "00"
            , "$-"
            , "$-,."
            , "-"
            , "-$"
            , ""
            , "- $"]
            .forEach(i => {
                object.name = i;
                ifNotValid(object);
            });
    });

});

describe("IsDate", function() {

    class MyClass {
        @IsDate()
        date: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "2011-08-04"
            , "2011-09-30"
            , "04. 08. 2011."
            , "08/04/2011"
            , "08/31/2011"
            , "2011.08.04"
            , "2/29/24"
            , "2-29-24"
            , "4. 8. 2011. GMT"
            , "2. 28. 2011. GMT"
            , "2. 29. 2008. GMT"
            , "2011-08-04 12:00"
            , "2/22/23"
            , "2-23-22"
            , "12"
            , "11/2/23 12:24"
            , "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)"
            , "2/22/23 23:24:26"
            , "2009-12T12:34"
            , "2009"
            , "2009-05-19"
            , "2009-05-19"
            , "2009-05"
            , "2009-001"
            , "2009-05-19"
            , "2009-05-19 00:00"
            , "2009-05-19 14:31"
            , "2009-05-19 14:39:22"
            , "2009-05-19T14:39Z"
            , "2009-05-19 14:39:22-06:00"
            , "2009-05-19 14:39:22+0600"
            , "2009-05-19 14:39:22-01"
            , "2015-10-20T00:53:09+08:00"
            , "2015-10-20T00:53:09+09:00"
            , "2015-10-20T00:53:09+10:00"
            , "2015-10-20T00:53:09+11:00"
            , "2015-10-20T00:53:09+12:00"
            , "2007-04-06T00:00"
            , "2010-02-18T16:23:48.5"
            , "200905"
            , "2009-"
            , "2009-05-19 14:"
            , "200912-01"
            , "Fri, 21 Nov 1997 09:55:06 -0600"
            , "Tue, 15 Nov 1994 12:45:26 GMT"
            , "Tue, 1 Jul 2003 10:52:37 +0200"
            , "Thu, 13 Feb 1969 23:32:54 -0330"
            , "Mon, 24 Nov 1997 14:22:01 -0800"
            , "Mon Sep 28 1964 00:05:49 GMT+1100 (AEDST)"
            , "Mon Sep 28 1964 00:05:49 +1100 (AEDST)"
            , "Mon Sep 28 1964 00:05:49 +1100"
            , "Mon Sep 28 1964 00:05:49 \nGMT\n+1100\n"
            , "Mon Sep 28 1964 00:05:49 \nGMT\n+1100\n(AEDST)"
            , "Thu,          13\n     Feb\n  1969\n        23:32\n     -0330"
            , "Thu,          13\n     Feb\n  1969\n        23:32\n     -0330 (Newfoundland Time)"
            , "24 Nov 1997 14:22:01 -0800"
            , "Thu,          29\n     Feb\n  1968\n        13:32\n     -0330"
            , "Fri, 30 Nov 1997 09:55:06 -0600"
            , "Wed, 10 Apr 2014 08:21:03 +0000"
            , "Wed, 9 Apr 2014 10:21:03 +0200"
            , "Wed, 9 Apr 2014 06:21:03 -0200"
            , "Wed, 9 Apr 2014 08:21:03 +0000"
        ].forEach(i => {
            object.date = i;
            ifValid(object);
        });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "foo"
            , "2011-foo-04"
            , "2011-09-31"
            , "2. 29. 1987. GMT"
            , "2. 29. 2011. GMT"
            , "2/29/25"
            , "2-29-25"
            , "GMT"
            , "2009367"
            , "2007-04-05T24:50"
            , "2009-000"
            , "2009-M511"
            , "2009M511"
            , "2009-05-19T14a39r"
            , "2009-05-19T14:3924"
            , "2009-0519"
            , "2009-05-1914:39"
            , "2009-05-19r14:39"
            , "2009-05-19 14a39a22"
            , "2009-05-19 14:39:22+06a00"
            , "2009-05-19 146922.500"
            , "2010-02-18T16.5:23.35:48"
            , "2010-02-18T16:23.35:48"
            , "2010-02-18T16:23.35:48.45"
            , "2009-05-19 14.5.44"
            , "2010-02-18T16:23.33.600"
            , "2010-02-18T16,25:23:48,444"
            , "2009-02-30 14:"
            , "200912-32"
            // hackage RFC2822 variants with invalid end-of-month
            , "Thu,          29\n     Feb\n  1969\n        13:32\n     -0330"
            , "Fri, 31 Nov 1997 09:55:06 -0600"
        ].forEach(i => {
            object.date = i;
            ifNotValid(object);
        });
    });

});

describe("IsDecimal", function() {

    class MyClass {
        @IsDecimal()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["123", "00123", "-00123", "0", "-0", "+123", "0.01", ".1", "1.0", "-.25", "-0", "0.0000000000001"]
            .forEach(i => {
                object.name = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["....", " ", "", "-", "+", ".", "0.1a", "a", "\n"]
            .forEach(i => {
                object.name = i;
                ifNotValid(object);
            });
    });

});

describe("IsDivisibleBy", function() {

    class MyClass {
        @IsDivisibleBy(2)
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [ "2", "4", "100", "1000" ]
            .forEach(i => {
                object.name = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "1"
            , "2.5"
            , "101"
            , "foo"
            , ""
        ]
            .forEach(i => {
                object.name = i;
                ifNotValid(object);
            });
    });

});

describe("IsEmail", function() {

    class MyClass {
        @IsEmail()
        email: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "foo@bar.com"
            , "x@x.au"
            , "foo@bar.com.au"
            , "foo+bar@bar.com"
            , "hans.m端ller@test.com"
            , "hans@m端ller.com"
            , "test|123@m端ller.com"
            , "test+ext@gmail.com"
            , "some.name.midd.leNa.me.+extension@GoogleMail.com"
            , "gmail...ignores...dots...@gmail.com"
            , "\"foobar\"@example.com"
            , "\"  foo  m端ller \"@example.com"
            , "\"foo\\@bar\"@example.com"
        ]
            .forEach(i => {
                object.email = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "invalidemail@"
            , "invalid.com"
            , "@invalid.com"
            , "foo@bar.com."
            , "somename@ｇｍａｉｌ.com"
            , "foo@bar.co.uk."
            , "z@co.c"
            , "ｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌ@gmail.com"
        ]
            .forEach(i => {
                object.email = i;
                ifNotValid(object);
            });
    });

});

describe("IsFQDN", function() {

    class MyClass {
        @IsFQDN()
        site: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "domain.com"
            , "dom.plato"
            , "a.domain.co"
            , "foo--bar.com"
            , "xn--froschgrn-x9a.com"
            , "rebecca.blackfriday"
        ]
            .forEach(i => {
                object.site = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "256.0.0.0"
            , "_.com"
            , "*.some.com"
            , "s!ome.com"
            , "domain.com/"
            , "/more.com"
        ]
            .forEach(i => {
                object.site = i;
                ifNotValid(object);
            });
    });

});

describe("IsFloat", function() {

    class MyClass {
        @IsFloat()
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "123"
            , "123."
            , "123.123"
            , "-123.123"
            , "-0.123"
            , "+0.123"
            , "0.123"
            , ".0"
            , "01.123"
            , "-0.22250738585072011e-307"
        ]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "-.123"
            , "  "
            , ""
            , "."
            , "foo"
        ]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsFullWidth", function() {

    class MyClass {
        @IsFullWidth()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "ひらがな・カタカナ、．漢字"
            , "３ー０　ａ＠ｃｏｍ"
            , "Ｆｶﾀｶﾅﾞﾬ"
            , "Good＝Parts"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "abc123"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsHalfWidth", function() {

    class MyClass {
        @IsHalfWidth()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            , "l-btn_02--active"
            , "abc123い"
            , "ｶﾀｶﾅﾞﾬ￩"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "あいうえお"
            , "００１１"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsVariableWidth", function() {

    class MyClass {
        @IsVariableWidth()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "ひらがなカタカナ漢字ABCDE"
            , "３ー０123"
            , "Ｆｶﾀｶﾅﾞﾬ"
            , "Good＝Parts"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "abc123"
            , "!\"#$%&()<>/+=-_? ~^|.,@`{}[]"
            , "ひらがな・カタカナ、．漢字"
            , "１２３４５６"
            , "ｶﾀｶﾅﾞﾬ"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsHexColor", function() {

    class MyClass {
        @IsHexColor()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "#ff0034"
            , "#CCCCCC"
            , "fff"
            , "#f00"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "#ff"
            , "fff0"
            , "#ff12FG"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsHexadecimal", function() {

    class MyClass {
        @IsHexadecimal()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "deadBEEF"
            , "ff0044"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abcdefg"
            , ""
            , ".."
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsIP", function() {

    class MyClass {
        @IsIP()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "127.0.0.1"
            , "0.0.0.0"
            , "255.255.255.255"
            , "1.2.3.4"
            , "::1"
            , "2001:db8:0000:1:1:1:1:1"
            , "2001:41d0:2:a141::1"
            , "::ffff:127.0.0.1"
            , "::0000"
            , "0000::"
            , "1::"
            , "1111:1:1:1:1:1:1:1"
            , "fe80::a6db:30ff:fe98:e946"
            , "::"
            , "::ffff:127.0.0.1"
            , "0:0:0:0:0:ffff:127.0.0.1"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "256.0.0.0"
            , "0.0.0.256"
            , "26.0.0.256"
            , "::banana"
            , "banana::"
            , "::1banana"
            , "::1::"
            , "1:"
            , ":1"
            , ":1:1:1::2"
            , "1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1"
            , "::11111"
            , "11111:1:1:1:1:1:1:1"
            , "2001:db8:0000:1:1:1:1::1"
            , "0:0:0:0:0:0:ffff:127.0.0.1"
            , "0:0:0:0:ffff:127.0.0.1"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsISBN version 10", function() {

    class MyClass {
        @IsISBN(10)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "3836221195", "3-8362-2119-5", "3 8362 2119 5"
            , "1617290858", "1-61729-085-8", "1 61729 085-8"
            , "0007269706", "0-00-726970-6", "0 00 726970 6"
            , "3423214120", "3-423-21412-0", "3 423 21412 0"
            , "340101319X", "3-401-01319-X", "3 401 01319 X"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "3423214121", "3-423-21412-1", "3 423 21412 1"
            , "978-3836221191", "9783836221191"
            , "123456789a", "foo"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsISBN version 13", function() {

    class MyClass {
        @IsISBN(13)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "9783836221191", "978-3-8362-2119-1", "978 3 8362 2119 1"
            , "9783401013190", "978-3401013190", "978 3401013190"
            , "9784873113685", "978-4-87311-368-5", "978 4 87311 368 5"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "9783836221190", "978-3-8362-2119-0", "978 3 8362 2119 0"
            , "3836221195", "3-8362-2119-5", "3 8362 2119 5"
            , "01234567890ab", "foo", ""
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsISO8601", function() {

    class MyClass {
        @IsISO8601()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "2009-12T12:34"
            , "2009"
            , "2009-05-19"
            , "2009-05-19"
            , "20090519"
            , "2009123"
            , "2009-05"
            , "2009-123"
            , "2009-222"
            , "2009-001"
            , "2009-W01-1"
            , "2009-W51-1"
            , "2009-W511"
            , "2009-W33"
            , "2009W511"
            , "2009-05-19"
            , "2009-05-19 00:00"
            , "2009-05-19 14"
            , "2009-05-19 14:31"
            , "2009-05-19 14:39:22"
            , "2009-05-19T14:39Z"
            , "2009-W21-2"
            , "2009-W21-2T01:22"
            , "2009-139"
            , "2009-05-19 14:39:22-06:00"
            , "2009-05-19 14:39:22+0600"
            , "2009-05-19 14:39:22-01"
            , "20090621T0545Z"
            , "2007-04-06T00:00"
            , "2007-04-05T24:00"
            , "2010-02-18T16:23:48.5"
            , "2010-02-18T16:23:48,444"
            , "2010-02-18T16:23:48,3-06:00"
            , "2010-02-18T16:23.4"
            , "2010-02-18T16:23,25"
            , "2010-02-18T16:23.33+0600"
            , "2010-02-18T16.23334444"
            , "2010-02-18T16,2283"
            , "2009-05-19 143922.500"
            , "2009-05-19 1439,55"
        ]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "200905"
            , "2009367"
            , "2009-"
            , "2007-04-05T24:50"
            , "2009-000"
            , "2009-M511"
            , "2009M511"
            , "2009-05-19T14a39r"
            , "2009-05-19T14:3924"
            , "2009-0519"
            , "2009-05-1914:39"
            , "2009-05-19 14:"
            , "2009-05-19r14:39"
            , "2009-05-19 14a39a22"
            , "200912-01"
            , "2009-05-19 14:39:22+06a00"
            , "2009-05-19 146922.500"
            , "2010-02-18T16.5:23.35:48"
            , "2010-02-18T16:23.35:48"
            , "2010-02-18T16:23.35:48.45"
            , "2009-05-19 14.5.44"
            , "2010-02-18T16:23.33.600"
            , "2010-02-18T16,25:23:48,444"
        ]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsIn", function() {

    class MyClass {
        @IsIn(["foo", "bar"])
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["foo", "bar"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["foobar", "barfoo", ""]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsInt", function() {

    class MyClass {
        @IsInt()
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "13"
            , "123"
            , "0"
            , "123"
            , "-0"
            , "+1"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "01"
            , "-01"
            , "000"
            , "100e10"
            , "123.123"
            , "   "
            , ""]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsJSON", function() {

    class MyClass {
        @IsJSON()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["{ \"key\": \"value\" }", "{}"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["{ key: \"value\" }", "{ 'key': 'value' }", "null", "1234", "false", "\"nope\""]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsLength", function() {

    class MyClass {
        @IsLength(2, 3)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["abc", "de"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [ "", "a", "abcd"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsLowercase", function() {

    class MyClass {
        @IsLowercase()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "abc123"
            , "this is lowercase."
            , "tr竪s 端ber"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "fooBar"
            , "123A"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsMongoId", function() {

    class MyClass {
        @IsMongoId()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "507f1f77bcf86cd799439011"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "507f1f77bcf86cd7994390"
            , "507f1f77bcf86cd79943901z"
            , ""
            , "507f1f77bcf86cd799439011 "]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsMultibyte", function() {

    class MyClass {
        @IsMultibyte()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "ひらがな・カタカナ、．漢字"
            , "あいうえお foobar"
            , "test＠example.com"
            , "1234abcDEｘｙｚ"
            , "ｶﾀｶﾅ"
            , "中文"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "abc"
            , "abc123"
            , "<>@\" *."]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

// todo: remove this because of useless
/*describe("IsNull", function() {

    class MyClass {
        @IsNull()
        str: any;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            ""
            , NaN
            , []
            , undefined
            , null]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            " "
            , "foo"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});*/

describe("IsNumeric", function() {

    class MyClass {
        @IsNumeric()
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "123"
            , "00123"
            , "-00123"
            , "0"
            , "-0"
            , "+123"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "123.123"
            , " "
            , "."]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsSurrogatePair", function() {

    class MyClass {
        @IsSurrogatePair()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "𠮷野𠮷"
            , "𩸽"
            , "ABC千𥧄1-2-3"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "吉野竈"
            , "鮪"
            , "ABC1-2-3"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("IsUrl", function() {

    class MyClass {
        @IsUrl()
        site: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "foobar.com"
            , "www.foobar.com"
            , "foobar.com/"
            , "valid.au"
            , "http://www.foobar.com/"
            , "http://www.foobar.com:23/"
            , "http://www.foobar.com:65535/"
            , "http://www.foobar.com:5/"
            , "https://www.foobar.com/"
            , "ftp://www.foobar.com/"
            , "http://www.foobar.com/~foobar"
            , "http://user:pass@www.foobar.com/"
            , "http://user:@www.foobar.com/"
            , "http://127.0.0.1/"
            , "http://10.0.0.0/"
            , "http://189.123.14.13/"
            , "http://duckduckgo.com/?q=%2F"
            , "http://foobar.com/t$-_.+!*\"(),"
            , "http://localhost:3000/"
            , "http://foobar.com/?foo=bar#baz=qux"
            , "http://foobar.com?foo=bar"
            , "http://foobar.com#baz=qux"
            , "http://www.xn--froschgrn-x9a.net/"
            , "http://xn--froschgrn-x9a.com/"
            , "http://foo--bar.com"
            , "http://høyfjellet.no"
            , "http://xn--j1aac5a4g.xn--j1amh"]
            .forEach(i => {
                object.site = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "xyz://foobar.com"
            , "invalid/"
            , "invalid.x"
            , "invalid."
            , ".com"
            , "http://com/"
            , "http://300.0.0.1/"
            , "mailto:foo@bar.com"
            , "rtmp://foobar.com"
            , "http://www.xn--.com/"
            , "http://xn--.com/"
            , "http://www.foobar.com:0/"
            , "http://www.foobar.com:70000/"
            , "http://www.foobar.com:99999/"
            , "http://www.-foobar.com/"
            , "http://www.foobar-.com/"
            , "http://foobar/# lol"
            , "http://foobar/? lol"
            , "http://foobar/ lol/"
            , "http://lol @foobar.com/"
            , "http://lol:lol @foobar.com/"
            , "http://lol:lol:lol@foobar.com/"
            , "http://lol: @foobar.com/"
            , "http://www.foo_bar.com/"
            , "http://www.foobar.com/\t"
            , "http://\n@www.foobar.com/"
            , ""
            , "http://foobar.com/" + new Array(2083).join("f")
            , "http://*.foo.com"
            , "*.foo.com"
            , "!.foo.com"
            , "http://example.com."
            , "http://localhost:61500this is an invalid url!!!!"
            , "////foobar.com"
            , "http:////foobar.com"]
            .forEach(i => {
                object.site = i;
                ifNotValid(object);
            });
    });

});

describe("IsUUID", function() {

    class MyClass {
        @IsUUID()
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
            , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
            , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            ""
            , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
            , "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx"
            , "A987FBC94BED3078CF079141BA07C9F3"
            , "934859"
            , "987FBC9-4BED-3078-CF07A-9141BA07C9F3"
            , "AAAAAAAA-1111-1111-AAAG-111111111111"]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsUUID 3", function() {

    class MyClass {
        @IsUUID(3)
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "A987FBC9-4BED-3078-CF07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            ""
            , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
            , "934859"
            , "AAAAAAAA-1111-1111-AAAG-111111111111"
            , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
            , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsUUID 4", function() {

    class MyClass {
        @IsUUID(4)
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "713ae7e3-cb32-45f9-adcb-7c4fa86b90c1"
            , "625e63f3-58f5-40b7-83a1-a72ad31acffb"
            , "57b73598-8764-4ad0-a76a-679bb6640eb1"
            , "9c858901-8a57-4791-81fe-4c455b099bc9"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            ""
            , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
            , "934859"
            , "AAAAAAAA-1111-1111-AAAG-111111111111"
            , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
            , "A987FBC9-4BED-3078-CF07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsUUID 5", function() {

    class MyClass {
        @IsUUID(5)
        num: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "987FBC97-4BED-5078-AF07-9141BA07C9F3"
            , "987FBC97-4BED-5078-BF07-9141BA07C9F3"
            , "987FBC97-4BED-5078-8F07-9141BA07C9F3"
            , "987FBC97-4BED-5078-9F07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            ""
            , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
            , "934859"
            , "AAAAAAAA-1111-1111-AAAG-111111111111"
            , "9c858901-8a57-4791-81fe-4c455b099bc9"
            , "A987FBC9-4BED-3078-CF07-9141BA07C9F3"]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("IsUppercase", function() {

    class MyClass {
        @IsUppercase()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [
            "ABC"
            , "ABC123"
            , "ALL CAPS IS FUN."
            , "   ."]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [
            "fooBar"
            , "123abc"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("Matches", function() {

    class MyClass {
        @Matches(/abc/)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["abc", "abcdef", "123abc"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["acb", "Abc"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("MinLength", function() {

    class MyClass {
        @MinLength(10)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["helloworld", "hello how are you"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["hellowar", "howareyou"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("MaxLength", function() {

    class MyClass {
        @MaxLength(10)
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["hellowar", "howareyou"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["helloworld!", "hello how are you"]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("MinNumber", function() {

    class MyClass {
        @MinNumber(10)
        num: number;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [10, 20, 30, 40]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [1, 2, 3, 4, 5, 6, 7, 8, 9, -10]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("MaxNumber", function() {

    class MyClass {
        @MaxNumber(10)
        num: number;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        [1, 2, 3, 4, 5, 6, 7, 8, 9, -10]
            .forEach(i => {
                object.num = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        [11, 20, 30, 40]
            .forEach(i => {
                object.num = i;
                ifNotValid(object);
            });
    });

});

describe("NotEmpty", function() {

    class MyClass {
        @NotEmpty()
        str: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        ["a", "abc"]
            .forEach(i => {
                object.str = i;
                ifValid(object);
            });
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        ["", undefined, null]
            .forEach(i => {
                object.str = i;
                ifNotValid(object);
            });
    });

});

describe("NotEmptyArray", function() {

    class MyClass {
        @NotEmptyArray()
        tags: string[];
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.tags = ["world"];
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.tags = [];
        ifNotValid(object);
    });

});

describe("MinSize", function() {

    class MyClass {
        @MinSize(2)
        tags: string[];
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.tags = ["world", "hello"];
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.tags = ["hi"];
        ifNotValid(object);
    });

});

describe("MaxSize", function() {

    class MyClass {
        @MaxSize(2)
        tags: string[];
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.tags = ["world", "hello"];
        ifValid(object);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.tags = ["hi", "hello", "javascript"];
        ifNotValid(object);
    });

});