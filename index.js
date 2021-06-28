// import "./styles.css";
// import image1 from "./edit.png";
// import image2 from "./delete.png";
// import emptyCartImage from "./empty.png";

let listOfItems;

let emptyImage = document.getElementById("emptyCart");
emptyImage.src = "./assets/empty-cart.png";
emptyImage.style.display = "none";

listOfItems = JSON.parse(window.localStorage.getItem("listOfGrocery")); //Getting data from local storage

if (listOfItems === null) {
	listOfItems = [];
}
//If local storage is empty, then image for empty cart will be shown
if (listOfItems.length <= 0) {
	emptyImage.style.display = "block";
}

//Create the list element to be updated in the Grocery List
function createListElement(itemName, quantity) {
	let listEntry = document.createElement("li");
	listEntry.innerHTML = `
  <div class="mainParaInList"><p class="itemNameInList">Item: <strong class="fullName">${itemName}</strong></p><p class="quantityInList">Quantity: <strong>${quantity}</strong></p></div>
  `;
	listEntry.classList.add("divOfList");

	let editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.setAttribute("aria-label", "Edit the Quantity of " + itemName);
	editButton.classList.add("editButton");
	editButton.addEventListener("click", () => {
		editItemFromList(itemName, quantity);
	});

	let deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.setAttribute(
		"aria-label",
		"Delete the " + itemName + " from the Grocery list"
	);
	deleteButton.classList.add("deleteButton");
	deleteButton.addEventListener("click", () => {
		deleteItemFromList(itemName, quantity);
	});

	let containerOfButtons = document.createElement("div");
	containerOfButtons.classList.add("divOfButtons");
	containerOfButtons.append(editButton);
	containerOfButtons.append(deleteButton);

	listEntry.append(containerOfButtons);

	return listEntry;
}

//For every element of localstorage, we will create a list entry, and append it to the main grocery list
listOfItems.forEach((data) => {
	let itemName = data["item"];
	let quantity = data["quantity"];

	let listEntry = createListElement(itemName, quantity);

	document.getElementById("groceryList").append(listEntry);
});

//Event Listneres for the buttons in the form
document.querySelector("#submitButton1").addEventListener("click", () => {
	addItemToList();
});

document.querySelector("#submitButton2").addEventListener("click", () => {
	updateItemToList();
});
document.querySelector("#resetButton2").addEventListener("click", () => {
	document.getElementById("editItemHeading").style.display = "none";
	document.getElementById("editItemForm").style.display = "none";

	document.getElementById("addItemHeading").style.display = "block";
	document.getElementById("addItemForm").style.display = "block";
});
// document.querySelector("#buttonInAlert").addEventListener("click", () => {
// 	console.log("Hello Working here correctly");
// 	document.getElementById("alertBox").style.display = "none";
// });

//When the page loads, initially  we will show "Add Grocery Item" Form
document.getElementById("editItemHeading").style.display = "none";
document.getElementById("editItemForm").style.display = "none";
document.getElementById("alertBox").style.display = "none";

//Whenever the "Add To Cart" button is pressed, this function will handle the data updation in the Grocery List
function addItemToList() {
	let itemName = document.getElementById("itemName1").value;
	let quantityValue = document.getElementById("quantity1").value;

	if (Number(quantityValue) <= 0) {
		// alert("Sorry!! We can not insert negative or zero quantity.");
		document.getElementById("textInAlert").textContent =
			"Sorry!! We can not insert negative or zero quantity";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 5000);
		// document.getElementById("buttonInAlert").focus();
	} else {
		let itemIndexInArray = listOfItems.findIndex(
			(entry) => entry["item"] == itemName
		);

		//Creating the new entry in array; If there is no existing item, with the inserted name
		if (itemIndexInArray == -1) {
			if (listOfItems.length == 0) emptyImage.style.display = "none"; //Removing image from display, if this is the first item in the list.

			listOfItems.push({
				item: itemName,
				quantity: quantityValue,
			});

			let listEntry = createListElement(itemName, quantityValue);
			document.getElementById("groceryList").append(listEntry);
		} else {
			//If there is an existing item, with the inserted name, then we will update its value in the array
			let currentValue = Number(listOfItems[itemIndexInArray]["quantity"]);
			currentValue += Number(quantityValue);
			quantityValue = String(currentValue);
			listOfItems[itemIndexInArray]["quantity"] = quantityValue;

			let listEntry = createListElement(itemName, quantityValue);

			let childInList =
				document.getElementsByClassName("divOfList")[itemIndexInArray];
			let parentInList = childInList.parentNode;
			parentInList.replaceChild(listEntry, childInList);
		}
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems)); //Updating the local storage
	}

	document.getElementById("itemName1").value = ""; //Reseting the form values, for further use
	document.getElementById("quantity1").value = "";
}

//Whenever the "Edit Item" button is pressed in the form, this function will handle the data updation in the Grocery List
function updateItemToList() {
	let itemName = document.getElementById("itemName2").value;
	let quantity = document.getElementById("quantity2").value;

	let itemIndexInArray = listOfItems.findIndex(
		(entry) => entry["item"] == itemName
	);

	//If we delete the entry, after pressing the edit button in the list
	if (itemIndexInArray == -1) {
		// alert("Sorry! There is no such item available in the cart");
		document.getElementById("textInAlert").textContent =
			"Sorry!! There is no such item available in the cart";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 5000);
	} else if (Number(quantity) <= 0) {
		// alert("Sorry!! We can not insert negative or zero quantity.");
		document.getElementById("textInAlert").textContent =
			"Sorry!! We can not insert negative or zero quantity";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 5000);
	} else {
		listOfItems[itemIndexInArray]["quantity"] = quantity;
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems));

		let listEntry = createListElement(itemName, quantity);

		let childInList =
			document.getElementsByClassName("divOfList")[itemIndexInArray];
		let parentInList = childInList.parentNode;
		parentInList.replaceChild(listEntry, childInList);
	}

	document.getElementById("itemName2").value = "";
	document.getElementById("quantity2").value = "";

	document.getElementById("editItemHeading").style.display = "none";
	document.getElementById("editItemForm").style.display = "none";

	document.getElementById("addItemHeading").style.display = "block";
	document.getElementById("addItemForm").style.display = "block";
}

//Whenever the edit button is pressed in the list, this function will be called, which in turn will call updateItemToList(), and update the form
function editItemFromList(itemName, quantity) {
	document.getElementById("addItemHeading").style.display = "none";
	document.getElementById("addItemForm").style.display = "none";

	document.getElementById("editItemHeading").style.display = "block";
	document.getElementById("editItemForm").style.display = "block";

	document.getElementById("itemName2").value = itemName;
	document.getElementById("quantity2").value = quantity;

	document.getElementById("quantity2").focus();
	document.getElementById("quantity2").click();
}

//This function will handle the updation, whenever we want to delete an item from the list
function deleteItemFromList(itemName, quantity) {
	let itemIndexInArray = listOfItems.findIndex(
		(entry) => entry["item"] == itemName
	);

	listOfItems.splice(itemIndexInArray, 1);
	window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems));
	document.getElementsByClassName("divOfList")[itemIndexInArray].remove();

	if (listOfItems.length == 0) emptyImage.style.display = "block"; //If the list is empty, emptyImage will be shown
}
