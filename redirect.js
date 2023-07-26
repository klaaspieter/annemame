(function() {
  function replacer(_, year, month, day, title) {
    return `${year}-${month}-${day}-${title}.md`;
  }

  const isPost = location.pathname.includes("/blog/post");

  if (!isPost) {
    return;
  }

  const newPath = location.pathname.replace(
    /\/blog\/post\/(?<year>\d{4})\/(?<month>\d{2})\/(?<day>\d{2})\/(?<title>.*)/gm,
    replacer
  );

  const newURL =
    "https://github.com/klaaspieter/annemame/tree/24d85589d22a4ccdc8b6d5aa23c7c37d9f46bf4d/_posts/" +
    newPath;

  location.replace(newURL);
})();
