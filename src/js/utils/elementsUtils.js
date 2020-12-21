// str elName, str classes
export function createElement(elName, classes = "", parent = null) {
  try {
    const result = document.createElement(elName);
    if (parent) {
      parent.appendChild(result);
    }
    if (classes) {
      result.classList.add(classes.trim());
    }

    return result;
  } catch (err) {
    throw new Error("Error in createElement func. Trying to do ".concat(elName).concat(" html tag")
      .concat(" Errr log: ").concat(err));
  }
}

export function configurateButton(newInnnerText, classes = "", parent = null) {
  const newButton = createElement("button", "basic_button ".concat(classes), parent);
  // newButton.classList.add("basic_button");
  newButton.innerText = newInnnerText;
  return newButton;
}

export default createElement;
