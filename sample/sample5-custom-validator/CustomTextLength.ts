import {ValidatorInterface} from "../../src/ValidatorInterface";
import {ValidatorConstraint} from "../../src/decorator/Validation";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorInterface {

    validate(text: string): boolean {
        return text.length > 1 && text.length < 10;
    }

}