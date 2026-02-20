const form = document.getElementById("registrationForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    fullName: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    state: document.getElementById("state").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    occupation: document.getElementById("occupation").value,
    educationLevel: document.getElementById("educationLevel").value,
    hasLaptop: document.getElementById("hasLaptop").value,
    priorTechExperience: document.getElementById("priorTechExperience").value,
    track: document.getElementById("trackFilter").value,
  };

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
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
      },
    });

    handler.openIframe();

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
});