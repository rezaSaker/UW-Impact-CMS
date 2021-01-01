/**
 *JS Class to handle all functionalities of the CMS
 */
class Main 
{

	constructor() 
	{
		this.isPopupFormOpen = false;
		this.openedPopupForm = null;

		//Show the home section and hide other sections of the content_body
		this.displaySection("home", "Home");

		//Add EventListeners to the menu buttons
		home_btn.addEventListener("click", function() { this.displaySection("home", "Home"); }.bind(this));
		basic_info_btn.addEventListener("click", function() { this.displaySection("basic_info", "Basic Information"); }.bind(this));
		team_info_btn.addEventListener("click", function() { this.displaySection("team_info", "Team Information"); }.bind(this));
		events_info_btn.addEventListener("click", function() { this.displaySection("events_info", "Events Information"); }.bind(this));
		social_media_info_btn.addEventListener("click", function() { this.displaySection("social_media_info", "Social Media Links"); }.bind(this));
		messages_btn.addEventListener("click", function() { this.displaySection("messages", "Messages"); }.bind(this));
		contact_us_btn.addEventListener("click", function() { this.displaySection("contact_us", "Contact Us"); }.bind(this));
		change_password_btn.addEventListener("click", function() { this.displaySection("change_password", "Change Password"); }.bind(this));

		//Add EventListeners to other buttons
		add_member_btn.addEventListener("click", function() { this.displayPopupForm(member_form); }.bind(this));
		add_event_btn.addEventListener("click", function() { this.displayPopupForm(event_form); }.bind(this));
		delete_btn.addEventListener("click", this.handleDeleteFormSubmission);
		close_member_form_btn.addEventListener("click", function() { this.closePopupForm(event, member_form); }.bind(this));
		close_event_form_btn.addEventListener("click", function() { this.closePopupForm(event, event_form); }.bind(this));
		close_delete_form_btn.addEventListener("click", function() { this.closePopupForm(event, delete_form); }.bind(this));

		//Load current information from the database
		this.loadBasicInfo();
		this.loadTeamInfo();
		this.loadEventsInfo();
		this.loadSocialMediaInfo();
	}


	//////////////////////////////////////////////////////////////////////////////
	//
	//EVENT HANDLER FUNCTIONS
	//
	/////////////////////////////////////////////////////////////////////////////

	/**
	 *Function to hide/display a particular section of the content
	 *@param { string } id - The id of the section to be displayed
	 *@param { string } title - Title of the section to be show
	 */
	displaySection(id, title)
	{
		//If there's any popup form open, close the popup form before changing section
		if(this.isPopupFormOpen)
		{
			this.openedPopupForm.getElementsByTagName("button")[0].click();
			this.isPopupFormOpen = false;
			this.openedPopupForm = null;
		}

		//Show the selected section and hide other sections of the content_body
		let contentSections = content_body.getElementsByTagName("div");
		
		for (let div of contentSections) 
		{			
			if(div.id == id) 
			{
				div.classList.remove("hidden");
				div.classList.add("visible");
			}
			else if(!div.classList.contains("member_info") && !div.classList.contains("event_box"))
			{
				div.classList.add("hidden");
			}
		}

		//Display the title of selected menu in the content header
		content_header.getElementsByTagName("h2")[0].textContent = title;

		//Mark the currently selected menu in menu bar and remove mark from previous menu button
		let menuButtons = menu_buttons.getElementsByTagName("li");
		let currentButtonId = id + "_btn";

		for(let li of menuButtons)
		{
			if(li.id == currentButtonId)
			{
				li.classList.add("active");
			}
			else if(li.classList.contains("active"))
			{
				li.classList.remove("active");
			}
		} 
	}


	//////////////////////////////////////////////////////////////////////////////
	//
	//FUNCTIONS FOR RETRIVING GROUP DATA FROM DATABASE
	//
	/////////////////////////////////////////////////////////////////////////////


	loadBasicInfo()
	{
		let formData = new FormData();
		let path = "http://localhost/uwimpact_cms_api/retrieveBasicInfo.php";

		this.makeXMLHttpRequest("POST", path, formData, this.plotBasicInfo);
	}

	plotBasicInfo(responseObj)
	{
		group_name.value = responseObj.name;
		group_initial.value = responseObj.initial;
		description.textContent = responseObj.description;
		mission_statement.textContent = responseObj.missionStatement;
		vision_statement.textContent = responseObj.visionStatement;
		why_join_us.textContent = responseObj.whyJoinUs;
		who_can_join.textContent = responseObj.whoCanJoin;
		how_to_join.textContent = responseObj.howToJoin;
		meeting_info.textContent = responseObj.meetingInfo;
	}

	loadTeamInfo()
	{
		let formData = new FormData();
		let path = "http://localhost/uwimpact_cms_api/retrieveTeamInfo.php";

		this.makeXMLHttpRequest("POST", path, formData, this.plotTeamInfo.bind(this));
	}

	plotTeamInfo(responseObjArr)
	{
		for(let key of Object.keys(responseObjArr))
		{
			let responseObj = responseObjArr[key];

			//New member_info div with the member id within team_info section
			let member = document.createElement("div");
			member.id = "member_" + responseObj.id;
			member.classList.add("member_info");
			team_info.appendChild(member);

			//Member name
			let nameP = document.createElement("p");
			let nameSpan = document.createElement("span");
			nameP.textContent = "Name: ";
			nameP.classList.add("font_bold");
			nameSpan.classList.add("name");
			nameSpan.classList.add("font_normal");
			nameSpan.textContent = responseObj.name;
			nameP.appendChild(nameSpan);
			member.appendChild(nameP);

			//Member designation 
			let desgP = document.createElement("p");
			let desgSpan = document.createElement("span");
			desgP.textContent = "Designation: ";
			desgP.classList.add("font_bold");
			desgSpan.classList.add("designation");
			desgSpan.classList.add("font_normal");
			desgSpan.textContent = responseObj.designation;
			desgP.appendChild(desgSpan);
			member.appendChild(desgP);

			//Edit button
			let editBtn = document.createElement("button");
			editBtn.classList.add("edit_member_btn");
			editBtn.textContent = "Edit";
			member.appendChild(editBtn);
			editBtn.addEventListener("click", function() { this.displayPopupForm(member_form, responseObj.id); }.bind(this));

			//Delete button
			let deleteBtn = document.createElement("button");
			deleteBtn.classList.add("delete_member_btn");
			deleteBtn.classList.add("delete_btn");
			deleteBtn.textContent = "Delete";
			member.appendChild(deleteBtn);
			deleteBtn.addEventListener("click", function() { this.displayPopupDeleteForm("member", responseObj.id); }.bind(this));
		}
	}

	loadEventsInfo()
	{
		let formData = new FormData();
		let path = "http://localhost/uwimpact_cms_api/retrieveEventsInfo.php";

		this.makeXMLHttpRequest("POST", path, formData, this.plotEventsInfo.bind(this));
	}

	plotEventsInfo(responseObjArr)
	{
		for(let key of Object.keys(responseObjArr))
		{
			let responseObj = responseObjArr[key];

			//New member_info div with the member id within team_info section
			let event = document.createElement("div");
			event.id = "event_" + responseObj.id;
			event.classList.add("event_box");
			events_info.appendChild(event);

			//Event title
			let titleP = document.createElement("p");
			let titleSpan = document.createElement("span");
			titleP.textContent = "Title: ";
			titleP.classList.add("font_bold");
			titleSpan.classList.add("title");
			titleSpan.classList.add("font_normal");
			titleSpan.textContent = responseObj.title;
			titleP.appendChild(titleSpan);
			event.appendChild(titleP);

			//Event description
			let desP = document.createElement("p");
			let desSpan = document.createElement("span");
			desP.textContent = "Description: ";
			desP.classList.add("font_bold");
			desSpan.classList.add("description");
			desSpan.classList.add("font_normal");
			desSpan.textContent = responseObj.description;
			desP.appendChild(desSpan);
			event.appendChild(desP);

			//Event date
			let dateP = document.createElement("p");
			let dateSpan = document.createElement("span");
			dateP.textContent = "Date: ";
			dateP.classList.add("font_bold");
			dateSpan.classList.add("date");
			dateSpan.classList.add("font_normal");
			dateSpan.textContent = responseObj.date;
			dateP.appendChild(dateSpan);
			event.appendChild(dateP);

			//Event date
			let timeP = document.createElement("p");
			let timeSpan = document.createElement("span");
			timeP.textContent = "Time: ";
			timeP.classList.add("font_bold");
			timeSpan.classList.add("time");
			timeSpan.classList.add("font_normal");
			timeSpan.textContent = responseObj.time;
			timeP.appendChild(timeSpan);
			event.appendChild(timeP);

			//Registration Link
			let regLinkP = document.createElement("p");
			let regLink = document.createElement("a");
			regLinkP.textContent = "Registration Link: ";
			regLinkP.classList.add("font_bold");
			regLink.classList.add("reg_link");
			regLink.classList.add("font_normal");
			regLink.href = responseObj.registrationLink;
			regLink.target = "_blank";
			regLink.textContent = responseObj.registrationLink;
			regLinkP.appendChild(regLink);
			event.appendChild(regLinkP);

			//Edit button
			let editBtn = document.createElement("button");
			editBtn.classList.add("edit_event_btn");
			editBtn.textContent = "Edit";
			event.appendChild(editBtn);
			editBtn.addEventListener("click", function() { this.displayPopupForm(event_form, responseObj.id); }.bind(this));

			//Delete button
			let deleteBtn = document.createElement("button");
			deleteBtn.classList.add("delete_event_btn");
			deleteBtn.classList.add("delete_btn");
			deleteBtn.textContent = "Delete";
			event.appendChild(deleteBtn);
			deleteBtn.addEventListener("click", function() { this.displayPopupDeleteForm("event", responseObj.id); }.bind(this));
		}
	}

	loadSocialMediaInfo()
	{
		let formData = new FormData();
		let path = "http://localhost/uwimpact_cms_api/retrieveSocialMediaInfo.php";

		this.makeXMLHttpRequest("POST", path, formData, this.plotSocialMediaInfo);
	}

	plotSocialMediaInfo(responseObj)
	{
		facebook_link.value = responseObj.facebook;
		instagram_link.value = responseObj.instagram;
		twitter_link.value = responseObj.twitter;
		linkedin_link.value = responseObj.linkedin;
		email_address.value = responseObj.email;
	}


	//////////////////////////////////////////////////////////////////////////////
	//
	//FUNCTIONS FOR HANDLING POPUP FORMS
	//
	/////////////////////////////////////////////////////////////////////////////

	/**
	 *Function to display a popup form
	 *@param { form object } form - Id of the form to be displayed
	 */
	displayPopupForm(form, content_id = 0)
	{
		//If the content_body is blurry, that means another popup form is already open
		if(!this.isPopupFormOpen)
		{
			form.classList.remove("hidden");
			form.classList.add("visible");
			this.isPopupFormOpen = true;
			this.openedPopupForm = form;

			//Make the content_body blurry
			content_body.classList.add("blurry");

			//If the content_id is non-zero that means the form is opened in edit mode.
			//So, we have to pre-fill the input feilds with the current information.
			if(content_id != 0 && form == member_form)
			{
				let member_info = document.getElementById("member_" + content_id);
				member_name.value = member_info.getElementsByClassName("name")[0].textContent;
				member_designation.value = member_info.getElementsByClassName("designation")[0].textContent;
				member_id.value = content_id;
				submit_member_info.value = "Update";
			}
			else if(content_id != 0 && form == event_form)
			{
				let event_info = document.getElementById("event_" + content_id);
				event_title.value = event_info.getElementsByClassName("title")[0].textContent;
				event_description.value = event_info.getElementsByClassName("description")[0].textContent;
				event_date.value = event_info.getElementsByClassName("date")[0].textContent;
				event_time.value = event_info.getElementsByClassName("time")[0].textContent;
				event_registration_link.value = event_info.getElementsByClassName("reg_link")[0].textContent;
				event_id.value = content_id;
				submit_event_info.value = "Update";
			}
			else if(form == member_form)
			{
				//Clear any previous value
				member_name.value = null;
				member_designation.value = null;
				member_id.value = content_id;
				submit_member_info.value = "Save Member Information";
			}
			else if(form == event_form)
			{
				//clear any previous value
				event_title.value = null;
				event_description.value = null;
				event_date.value = null;
				event_time.value = null;
				event_registration_link.value = null;
				event_id.value = content_id;
				submit_event_info.value = "Save Event Information";
			}
		}
	}

	/**
	 *Function to display the popup form for showing warning message before deleting an event or member
	 *@param { string } type - The type of the content. Ex. member or event
	 *@param { int } id - The id of the member or the event that is to be deleted
	 */
	displayPopupDeleteForm(type, id)
	{
		//If content_body is blurred, that means another popup form is already open
		if(!this.isPopupFormOpen)
		{
			//Display the delete form
			delete_form.classList.remove("hidden");
			delete_form.classList.add("visible");
			this.isPopupFormOpen = true;
			this.openedPopupForm = delete_form;

			//Fill the warning label and hidden filled with proper info
			if(type == "member")
			{
				delete_warning.textContent = "The selected member will be permanently deleted from our database. Are you sure you want to delete?";
				delete_type.value = "member";
				delete_id.value = id;
			}
			else if(type == "event")
			{
				delete_warning.textContent = "The selected event will be permanently deleted from our database. Are you sure you want to delete?";
				delete_type.value = "event";
				delete_id.value = id;
			}

			//Make the content_body blurry
			content_body.classList.add("blurry");
		}
	}

	/**
	 *Function to hide a popup form
	 *@param { event object } event - The click event object
	 *@param { form object } form - Id of the form to be hidden
	 */
	closePopupForm(event, form)
	{
		//Prevent any form submission due to the click of cancel button
		event.preventDefault();

		//Hide the form
		form.classList.remove("visible");
		form.classList.add("hidden");
		this.isPopupFormOpen = false;
		this.openedPopupForm = null;

		//Clear out the background blurryness
		content_body.classList.remove("blurry");
	}



	//////////////////////////////////////////////////////////////////////////////
	//
	//FUNCTIONS FOR HANDLING FORM SUBMISSION
	//
	/////////////////////////////////////////////////////////////////////////////

	/**
	 *EventHandler function to handle the submission of the delete_form
	 *@param { event object } event The button click event object.
	 */
	handleDeleteFormSubmission(event)
	{
		//Function not complete
	}


	//////////////////////////////////////////////////////////////////////////////
	//
	//FUNCTIONS FOR MAKING SERVER REQUESTS
	//
	/////////////////////////////////////////////////////////////////////////////

	makeXMLHttpRequest(method, path, formData, success_handler)
	{
		let xhr = new XMLHttpRequest();

		//Append aditional form feilds for API to verify the request
		formData.append("userId", localStorage.getItem("userId"));
		formData.append("accessKey", localStorage.getItem("accessKey"));

		xhr.open(method, path, true);
		xhr.send(formData);

		this.xhrRequestHandler(xhr, success_handler);
	}

	xhrRequestHandler(xhr, success_handler)
	{
		xhr.onload = function()
		{
			if(xhr.status >= 200 && xhr.status < 300) 
			{
				if(xhr.response != "ERROR")
				{
					console.log(xhr.response);
					let responseObj = JSON.parse(xhr.response);
					success_handler(responseObj);				    
				}
				else
				{
					this.showError();
				}
			}
			else //if the remote server sent an error
			{
				this.showError();
			}
		}.bind(this);
	}

	showError()
	{
		alert("Oops! Something went wrong. Please try again.");
	}
	
}