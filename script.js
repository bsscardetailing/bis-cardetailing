const burger = document.getElementById("burger");
const sidebar = document.getElementById("sidebar");

burger.addEventListener("click", () => {
    sidebar.classList.toggle("active");

    if (sidebar.classList.contains("active")) {
        burger.textContent = "✕";
    } else {
        burger.textContent = "☰";
    }
});
