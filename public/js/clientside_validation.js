$(document).ready(function () {
  let searchForm = $("#searchForm"),
  searchTermInput = $("#search_term"),
  searchKeywordInput = $("#search_keyword"),
  channelList = $("#channelList"),
  addChannelForm = $("#addChannelForm"),
  addReviewForm = $("#addReviewForm");
  
  $("#addChannelForm").submit(function (event) {
  event.preventDefault();
  if (validateAddChannelForm()) {
  const formData = {
  channelTitle: $("#channelTitle").val(),
  channelOwnerName: $("#channelOwnerName").val(),
  channelDescription: $("#channelDescription").val(),
  channelWebsite: $("#channelWebsite").val(),
  keywords: $("#keywords").val().split(",").map(kw => kw.trim()),
  categories: $("#categories").val().split(",").map(cat => cat.trim()),
  startingAge: parseInt($("#startingAge").val(), 10),
  };
  
  $.ajax({
  url: "/channels",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify(formData),
  success: function () {
  alert("Channel added successfully.");
  window.location.href = "/channels";
  },
  error: function (xhr) {
  let errorMessage = xhr.responseText || "An unknown error occurred.";
  if (xhr.status === 401) {
  errorMessage = "You are not logged in/unauthorized.";
  window.location.href = "/login";
  }
  $("#errorDisplay").text(errorMessage).show();
  },
  });
  } else {
  $("#errorDisplay").text("Please fill all required fields correctly.");
  }
  });
  
  searchForm.submit(function (event) {
  event.preventDefault();
  let searchQuery = searchTermInput.val();
  if (!searchQuery.trim()) {
  alert("Your search input must not be empty or made of just spaces");
  return;
  }
  
  $.ajax({
  method: "GET",
  url: `/channels/search?search_term=${encodeURIComponent(searchQuery)}`,
  dataType: "json",
  success: function (data) {
  channelList.empty();
  if (data.length > 0) {
  data.forEach(function (channel) {
  const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
  const listItem = $("<li>").append(link);
  channelList.append(listItem);
  });
  bindEventsToChannelItem();
  } else {
  channelList.append($("<li>").text("No channels found."));
  }
  },
  error: function () {
  alert("Error searching channels.");
  },
  });
  });
  
  $("#searchKeywordForm").submit(function (event) {
  event.preventDefault();
  let searchQuery = searchKeywordInput.val();
  if (!searchQuery.trim()) {
  alert("Please enter a keyword to search.");
  return;
  }
  
  $.ajax({
  method: "GET",
  url: `/channels/searchKeyword?search_keywords=${encodeURIComponent(searchQuery)}`,
  dataType: "json",
  success: function (data) {
  channelList.empty();
  if (data.length > 0) {
  data.forEach(function (channel) {
  const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
  const listItem = $("<li>").append(link);
  channelList.append(listItem);
  });
  bindEventsToChannelItem();
  } else {
  channelList.append($("<li>").text("No channels found."));
  }
  },
  error: function () {
  alert("Error searching channels by keyword.");
  },
  });
  });

  $("#addReviewForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission

    let errorMessages = [];
    const reviewTitle = $("#reviewTitle").val().trim();
    const reviewDescription = $("#reviewDescription").val().trim();
    const reviewRating = parseFloat($("#reviewRating").val().trim());
    let isValid = true;

    // Validate Review Title
    if (!reviewTitle) {
        errorMessages.push("Review title cannot be empty.");
        isValid = false;
    }

    // Validate Review Description
    if (!reviewDescription) {
        errorMessages.push("Review description cannot be empty.");
        isValid = false;
    }

    // Validate Review Rating
    if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
        errorMessages.push("Rating must be a number between 1 and 5.");
        isValid = false;
    }

    // Display errors or submit the form
    if (!isValid) {
        $("#addReviewError").html(errorMessages.join("<br>")).show();
    } else {
        // If all validations pass, submit the form programmatically
        this.submit();
    }
});
  
  function validateAddChannelForm() {
  return $("#addChannelForm")[0].checkValidity();
  }
  
  function bindEventsToChannelItem() {
  channelList.on("click", "a", function (event) {
  event.preventDefault();
  let channelId = $(this).data("id");
  window.location.href = `http://localhost:3000/channels/${channelId}`;
  });
  }
  });
  
  async function removeReview(id) {
  $.ajax({
  url: `/review/${id}`,
  method: "DELETE",
  success: function () {
  alert("Review removed successfully!");
  window.location.reload();
  },
  error: function (xhr) {
  console.log("Error received:", xhr.responseText);
  let errorMessage = "An unknown error occurred.";
  
  if (xhr.status === 401) {
  errorMessage = "You are not logged in/unauthorized.";
  alert(errorMessage);
  window.location.href = "/login";
  } else if (xhr.status === 400) {
  errorMessage = xhr.responseText;
  alert(errorMessage);
  }
  $("#reviewError").text(errorMessage).show();
  },
  });
  }

// SAVE 2
// $(document).ready(function () {
//   let searchForm = $("#searchForm"),
//       searchTermInput = $("#search_term"),
//       searchKeywordInput = $("#search_keyword"),
//       channelList = $("#channelList"),
//       addChannelForm = $("#addChannelForm"),
//       addReviewForm = $("#addReviewForm");

//   // Function to display error messages
//   function displayErrorMessages(errorMessages) {
//       $("#errorDisplay").html(errorMessages.join("<br>")).show();
//   }

//   // Client-side validation for adding a channel
//   $("#addChannelForm").submit(function (event) {
//       event.preventDefault();

//       let errorMessages = [];
//       const channelTitle = $("#channelTitle").val().trim();
//       const channelOwnerName = $("#channelOwnerName").val().trim();
//       const channelDescription = $("#channelDescription").val().trim();
//       const channelWebsite = $("#channelWebsite").val().trim();
//       const keywords = $("#keywords").val().trim().split(',').map(kw => kw.trim());
//       const categories = $("#categories").val().trim().split(',').map(cat => cat.trim());
//       const startingAge = $("#startingAge").val().trim();

//       if (!channelTitle) errorMessages.push("Channel title cannot be empty.");
//       if (!channelOwnerName) errorMessages.push("Channel owner name cannot be empty.");
//       if (!channelDescription) errorMessages.push("Channel description cannot be empty.");
//       if (!/^(http:\/\/www\.).+(\.com)$/.test(channelWebsite)) errorMessages.push("Channel website must start with 'http://www.' and end with '.com'.");

//       if (!startingAge || isNaN(startingAge) || parseInt(startingAge) <= 0) {
//           errorMessages.push("Parental Guidance Age must be a positive number.");
//       }

//       if (errorMessages.length === 0) {
//           this.submit();
//       } else {
//           displayErrorMessages(errorMessages);
//       }
//   });

//   // Search forms validation
//   $("#searchForm, #searchKeywordForm").submit(function (event) {
//       event.preventDefault();
//       let searchQuery = $(this).find("input[type='text']").val().trim();

//       if (!searchQuery) {
//           alert("Search input cannot be empty.");
//           return;
//       }

//       // Perform AJAX search if input is valid
//       $.ajax({
//           method: "GET",
//           url: `/channels/search${this.id === "searchForm" ? "" : "Keyword"}?search_term=${encodeURIComponent(searchQuery)}`,
//           dataType: "json",
//           success: function (data) {
//               channelList.empty();
//               if (data.length > 0) {
//                   data.forEach(function (channel) {
//                       const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
//                       const listItem = $("<li>").append(link);
//                       channelList.append(listItem);
//                   });
//                   bindEventsToChannelItem();
//               } else {
//                   channelList.append($("<li>").text("No channels found."));
//               }
//           },
//           error: function () {
//               alert("Error searching channels.");
//           }
//       });
//   });

//   function bindEventsToChannelItem() {
//       channelList.on("click", "a", function (event) {
//           event.preventDefault();
//           let channelId = $(this).data("id");
//           window.location.href = `http://localhost:3000/channels/${channelId}`;
//       });
//   }

//   async function removeReview(id) {
//       $.ajax({
//           url: `/review/${id}`,
//           method: "DELETE",
//           success: function () {
//               alert("Review removed successfully!");
//               window.location.reload();
//           },
//           error: function (xhr) {
//               let errorMessage = xhr.responseText || "An unknown error occurred.";
//               if (xhr.status === 401) {
//                   errorMessage = "You are not logged in/unauthorized.";
//                   alert(errorMessage);
//                   window.location.href = "/login";
//               } else if (xhr.status === 400) {
//                   alert(xhr.responseText);
//               }
//               $("#reviewError").text(errorMessage).show();
//           }
//       });
//   }
// });







