export class ComponentValidator {
  private nameRegEx = new RegExp("^([A-Za-z\d])+$"); // Only letters
  private nameError = "Component name may only include letters and numbers";

  private locationRegEx = new RegExp("^([A-Za-z\-_\d\\\/])+$"); // Letters, numbers, underscores, hashes and slashes
  private locationErrorMessage =
    "Component name may only include letters, numbers, underscores, hashes and slashes.";

  validateName(input: string) {
    const testResult = this.nameRegEx.test(input);
    return testResult ? true : this.nameError;
  }

  validateLocation(input: string) {
    const testResult = this.locationRegEx.test(input);
    return testResult ? true : this.locationErrorMessage;
  }
}
