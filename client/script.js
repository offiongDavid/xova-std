const form = document.getElementById("registrationForm");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Disable button and show loading
  submitBtn.disabled = true;
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Processing...";
 

  const data = {
    fullName: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    state: document.getElementById("state").value.trim(),
    age: document.getElementById("age").value.trim(),
    gender: document.getElementById("gender").value,
    occupation: document.getElementById("occupation").value.trim(),
    educationLevel: document.getElementById("educationLevel").value,
    hasLaptop: document.getElementById("hasLaptop").value,
    priorTechExperience: document.getElementById("priorTechExperience").value,
    track: document.getElementById("trackFilter").value,
  };

  // Check all required fields before sending
  for (let key in data) {
    if (!data[key]) {
      alert("Please fill all fields before submitting");
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      return;
    }
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      return;
    }

    // ✅ Registration success
    alert("Registration successful! Proceeding to payment...");

    const handler = PaystackPop.setup({
      key: "pk_live_acd243e8bcf0d2b2dc63ab97db48e217ea0987d5",
      email: data.email,
      amount: 3000 * 100,
      currency: "NGN",

      callback: function (response) {
        fetch("/api/payment-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            reference: response.reference,
          }),
        }).then(() => {
          alert("Payment successful!");
          window.location.reload();
        });
      },

      onClose: function () {
        alert("Payment window closed.");
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      },
    });

    handler.openIframe();
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
  }
});