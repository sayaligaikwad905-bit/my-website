function toggleStatus() {
  const btn = event.target;
  if (btn.innerText === "Available") {
    btn.innerText = "Busy";
    btn.style.background = "#dc3545";
  } else {
    btn.innerText = "Available";
    btn.style.background = "#0d6efd";
  }
}