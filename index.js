let listOfItems;

let emptyImage = document.getElementById("emptyCart"); //updating the image for empty cart
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
  <div class="mainParaInList" id=${itemName}><p class="itemNameInList">Item: <strong class="fullName">${itemName}</strong></p><p class="quantityInList">Quantity: <strong>${quantity}</strong></p></div>
  `;
	listEntry.classList.add("divOfList");

	let editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.setAttribute("aria-describedby", itemName);
	editButton.classList.add("editButton");
	editButton.addEventListener("click", () => {
		editItemFromList(itemName, quantity);
	});

	let deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.setAttribute("aria-describedby", itemName);
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

//To make the Add Item Form visible on screen
function showAddForm() {
	document.getElementById("editItemHeading").style.display = "none";
	document.getElementById("editItemForm").style.display = "none";

	document.getElementById("addItemHeading").style.display = "block";
	document.getElementById("addItemForm").style.display = "block";
}

//To make the Edit Item Form visible on screen
function showEditForm() {
	document.getElementById("addItemHeading").style.display = "none";
	document.getElementById("addItemForm").style.display = "none";

	document.getElementById("editItemHeading").style.display = "block";
	document.getElementById("editItemForm").style.display = "block";
}

//For every element of localstorage, we will create a list entry, and append it to the main grocery list
listOfItems.forEach((data) => {
	let itemName = data["item"];
	let quantity = data["quantity"];

	let listEntry = createListElement(itemName, quantity);

	document.getElementById("groceryList").append(listEntry);
});

//Event Listneres for the buttons in the form
document.getElementById("skipButton").addEventListener("click", () => {
	skipToItem();
});

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
document.getElementById("skipLink").addEventListener("focus", () => {
	document.getElementById("skipElement").value = "";
});

//When the page loads, initially  we will show "Add Grocery Item" Form
showAddForm();
document.getElementById("alertBox").style.display = "none";

//Function for skip link
function skipToItem() {
	let itemName = document.getElementById("skipElement").value;
	let itemIndexInArray = listOfItems.findIndex(
		(entry) => entry["item"] == itemName
	);
	if (itemIndexInArray == -1) {
		document.getElementById("textInAlert").textContent =
			"Sorry!! There is no such Item available in the Grocery List";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 10000);
		document.getElementById("skipElement").focus();
	} else {
		document.getElementById("skipElement").value = "";
		document
			.getElementsByClassName("divOfList")
			[itemIndexInArray].querySelectorAll("button")[0]
			.focus();
	}
}

//Whenever the "Add To Cart" button is pressed, this function will handle the data updation in the Grocery List
function addItemToList() {
	let itemName = document.getElementById("itemName1").value;
	let quantityValue = document.getElementById("quantity1").value;

	if (Number(quantityValue) <= 0) {
		document.getElementById("textInAlert").textContent =
			"Sorry!! We can not insert negative or zero quantity";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 10000);
		document.getElementById("quantity1").focus();
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
			document.getElementById("groceryList").lastChild.focus();
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
			document.getElementsByClassName("divOfList")[itemIndexInArray].focus();
			// document.getElementById("divOfList")[itemIndexInArray].select();
		}
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems)); //Updating the local storage
		document.getElementById("itemName1").value = ""; //Reseting the form values, for further use
		document.getElementById("quantity1").value = "";
	}
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
		document.getElementById("textInAlert").textContent =
			"Sorry!! There is no such item available in the cart";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 10000);
		document.getElementById("itemName2").focus();
	} else if (Number(quantity) <= 0) {
		document.getElementById("textInAlert").textContent =
			"Sorry!! We can not insert negative or zero quantity";
		document.getElementById("alertBox").style.display = "inline-flex";
		setTimeout(() => {
			document.getElementById("alertBox").style.display = "none";
		}, 10000);
		document.getElementById("quantity2").focus();
	} else {
		listOfItems[itemIndexInArray]["quantity"] = quantity;
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems));

		let listEntry = createListElement(itemName, quantity);

		let childInList =
			document.getElementsByClassName("divOfList")[itemIndexInArray];
		let parentInList = childInList.parentNode;
		parentInList.replaceChild(listEntry, childInList);

		document.getElementById("itemName2").value = "";
		document.getElementById("quantity2").value = "";
		showAddForm();
	}
}

//Whenever the edit button is pressed in the list, this function will be called, which in turn will call updateItemToList(), and update the form
function editItemFromList(itemName, quantity) {
	document.getElementById("itemName1").value = "";
	document.getElementById("quantity1").value = "";
	showEditForm();
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

	if (document.getElementById("itemName2").value == itemName) {
		document.getElementById("itemName2").value = "";
		document.getElementById("quantity2").value = "";
		showAddForm();
	}
	if (listOfItems.length == 0) emptyImage.style.display = "block"; //If the list is empty, emptyImage will be shown
}
