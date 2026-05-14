document.querySelectorAll(".order-form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".order-btn");
    const originalText = submitBtn.innerHTML;

    // Collect form data
    const formData = new FormData(form);
    const data = {
      medicineId: formData.get("medicineId"),
      quantity: formData.get("quantity"),
      price: formData.get("price"),
    };

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';

      const response = await fetch("/user/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Success: Show a temporary success state on the button
        submitBtn.style.background = "var(--success)";
        submitBtn.innerHTML = '<i class="ph ph-check"></i>';

        setTimeout(() => {
          submitBtn.style.background = "";
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      } else {
        alert("Failed to place order. Please check stock levels.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("A network error occurred.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
