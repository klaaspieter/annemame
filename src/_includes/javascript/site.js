document.addEventListener("DOMContentLoaded", function () {
  const themeButtons = [
    document.getElementById("theme-almond"),
    document.getElementById("theme-dusk"),
    document.getElementById("theme-ice"),
    document.getElementById("theme-blueberry"),
    document.getElementById("theme-lavendar"),
    document.getElementById("theme-pink"),
    document.getElementById("theme-hopbush"),
    document.getElementById("theme-blush"),
    document.getElementById("theme-sundown"),
    document.getElementById("theme-peach"),
    document.getElementById("theme-merino"),
  ];

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.id.replace("theme-", ""));
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    setCookie("theme", theme, 365);
  }

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
});
