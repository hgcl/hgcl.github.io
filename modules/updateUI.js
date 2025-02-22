/**
 * Function that updates the DOM for every new scene
 */

const choicesEl = document.getElementById("choices");

export function updateScene(element, ...args) {
  const sceneEl = document.getElementById("scene");
  const locationEl = document.getElementById("location");
  const descriptionEl = document.getElementById("description");

  let scene = args[0];
  let index = args[1];

  switch (element) {
    case "scene":
      sceneEl.setAttribute("class", scene.id);
      break;

    case "location":
      locationEl.textContent = scene.location;
      break;

    // when args[0] is "description", the function needs an extra "index" arg
    case "description":
      // Reset to nothing (only if description is undivided, and shown in full)
      if (index === 0) {
        descriptionEl.replaceChildren();
      }
      const descriptionArray = scene.description[index].split(/\n\n/);
      descriptionArray.forEach((line) => {
        // Replace `{{xxx}}` placeholders with actual buttons
        // the 3 captured groups are (1) the button label, (2) the id, (3) the function it calls
        line = line.replaceAll(
          /{{(.*?)\|(.*?)\|(.*?)}}/g,
          `<button id="$2" onclick="$3;">$1<\/button>`
        );
        // Replace `_xxx_` placeholders with empasized tag
        line = line.replaceAll(/_(.*?)_/g, `<em>$1<\/em>`);
        let p = document.createElement("p");
        p.innerHTML = line;
        descriptionEl.appendChild(p);
      });
      break;

    case "choices":
      // Create a button for each choice and record its index number in `data-index`
      scene.choices.forEach((choice, i) => {
        let btn = document.createElement("button");
        btn.textContent = choice.name;
        // If choice is to be hidden by default
        if (choice.hideUntilEnd) {
          btn.setAttribute("hidden", "true");
        }
        // Append a class name to choices with special actions
        let specialAction = choice.specialAction;
        if (specialAction) {
          btn.setAttribute("onclick", `${specialAction}();`);
        }
        choicesEl.appendChild(btn);
        // Record choice index number in `data-index` attribute
        btn.setAttribute("data-index", i);
      });
      break;
  }
}

export function updatePlayer(element, ...args) {
  const pointsEl = document.getElementById("points");
  const inventoryEl = document.getElementById("inventory");

  let player = args[0];

  switch (element) {
    case "points":
      pointsEl.textContent = player.points;
      break;

    case "inventory":
      inventoryEl.replaceChildren(); // reset to nothing
      player.inventory.forEach((item) => {
        let span = document.createElement("span");
        span.textContent = item.name;
        inventoryEl.appendChild(span);
      });
      break;
  }
}

/**
 * Transform one-use buttons into normal text
 * where `buttonEl` is the HTML element found in the DOM
 */
export function buttonToText(buttonEl) {
  // TODO is inserting HTML like this dangerous?
  buttonEl.insertAdjacentHTML("afterend", `<em>${buttonEl.textContent}</em>`);
  buttonEl.remove();
}

/**
 * Show all choices that had a `hidden` attribute
 */
export function showAllChoices() {
  Array.from(choicesEl.childNodes).forEach((el) =>
    el.removeAttribute("hidden")
  );
}

/**
 * Show modal that shows new earned points
 * TODO: where to show points on screen
 * TODO: add focus for screen reader
 */

export function notifyPoints(points) {
  // Show notification
  const notificationEl = document.getElementById("notification");
  notificationEl.removeAttribute("hidden");

  // Update content element
  const content = notificationEl.querySelector("p");
  content.textContent = `Good job, you earned ${points} more point(s)!`;

  // Add automatic closing timeout
  let timer = 3000;
  setTimeout(function () {
    notificationEl.setAttribute("hidden", "true");
  }, timer);
}
