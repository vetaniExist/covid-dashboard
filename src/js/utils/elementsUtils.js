// str elName, str classes
export function createEl(elName, classes) {
  try {
    const result = document.createElement(elName);
    result.classList.add(classes.trim());
    return;
  } catch (err) {
    throw new Error("Error in createEl func. Trying to do ".concat(elName).concat(" html tag").concat(" Errr log: ")
      .concat(err));
  }
}

export function configurateButton(newInnnerText, classes = "") {
  const newButton = createEl("button", "basic_button ".concat(classes));
  // newButton.classList.add("basic_button");
  newButton.innerText = newInnnerText;
  return newButton;
}
