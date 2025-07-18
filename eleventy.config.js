import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import navigation from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItFootnote from "markdown-it-footnote";
import filters from "./_config/filters.js";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language || "plain"}`,
      "data-language": function ({ language }) {
        return resolvePrismLanguage(language);
      },
    },
    init: function ({ Prism }) {
      Prism.languages.xcconfig = {
        comment: {
          pattern: /\/\/.*/,
          greedy: true,
        },
        include: {
          pattern: /#include\s+"[^"]*"/,
          inside: {
            directive: /#include/,
            string: /"[^"]*"/,
          },
        },
        key: /^[A-Z_][A-Z0-9_]*(?=\s*(?:\[|=))/m,
        string: /"[^"]*"/,
        operator: /=/,
      };
    },
  });
  eleventyConfig.addPlugin(filters);
  eleventyConfig.addPlugin(navigation);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    stylesheet: "/pretty-atom-feed.xsl",
    collection: {
      name: "post",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "annema.me",
      base: "https://annema.me/",
      author: {
        name: "Klaas Pieter Annema",
      },
    },
  });

  eleventyConfig.amendLibrary("md", (md) => {
    md.use(markdownItFootnote);
  });

  eleventyConfig.addBundle("css", {
    transforms: [
      async function (content) {
        if (isCSSNakedDay()) {
          return "";
        }

        return content;
      },
    ],
  });
  eleventyConfig.addGlobalData("isCSSNakedDay", isCSSNakedDay());

  eleventyConfig.addBundle("js");

  eleventyConfig.addPassthroughCopy({
    "./src/public/": "/",
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
}

function isCSSNakedDay() {
  const now = Date.now();
  const currentYear = new Date().getFullYear();
  const startEpoch = new Date(`${currentYear}-04-09T00:00:00+1400`).getTime();
  const endEpoch = new Date(`${currentYear}-04-09T23:59:59-1200`).getTime();

  return startEpoch <= now && now <= endEpoch;
}

//https://prismjs.com/plugins/show-language/
const PRISM_LANGUAGES = {
  none: "Plain text",
  plain: "Plain text",
  plaintext: "Plain text",
  text: "Plain text",
  txt: "Plain text",
  html: "HTML",
  xml: "XML",
  svg: "SVG",
  xcconfig: "Xcode Configuration",
  mathml: "MathML",
  ssml: "SSML",
  rss: "RSS",
  css: "CSS",
  clike: "C-like",
  js: "JavaScript",
  abap: "ABAP",
  abnf: "ABNF",
  al: "AL",
  antlr4: "ANTLR4",
  g4: "ANTLR4",
  apacheconf: "Apache Configuration",
  apl: "APL",
  aql: "AQL",
  ino: "Arduino",
  arff: "ARFF",
  armasm: "ARM Assembly",
  "arm-asm": "ARM Assembly",
  art: "Arturo",
  asciidoc: "AsciiDoc",
  adoc: "AsciiDoc",
  aspnet: "ASP.NET (C#)",
  asm6502: "6502 Assembly",
  asmatmel: "Atmel AVR Assembly",
  autohotkey: "AutoHotkey",
  autoit: "AutoIt",
  avisynth: "AviSynth",
  avs: "AviSynth",
  "avro-idl": "Avro IDL",
  avdl: "Avro IDL",
  awk: "AWK",
  gawk: "GAWK",
  sh: "Shell",
  basic: "BASIC",
  bbcode: "BBcode",
  bbj: "BBj",
  bnf: "BNF",
  rbnf: "RBNF",
  bqn: "BQN",
  bsl: "BSL (1C:Enterprise)",
  oscript: "OneScript",
  csharp: "C#",
  cs: "C#",
  dotnet: "C#",
  cpp: "C++",
  cfscript: "CFScript",
  cfc: "CFScript",
  cil: "CIL",
  cilkc: "Cilk/C",
  "cilk-c": "Cilk/C",
  cilkcpp: "Cilk/C++",
  "cilk-cpp": "Cilk/C++",
  cilk: "Cilk/C++",
  cmake: "CMake",
  cobol: "COBOL",
  coffee: "CoffeeScript",
  conc: "Concurnas",
  csp: "Content-Security-Policy",
  "css-extras": "CSS Extras",
  csv: "CSV",
  cue: "CUE",
  dataweave: "DataWeave",
  dax: "DAX",
  django: "Django/Jinja2",
  jinja2: "Django/Jinja2",
  "dns-zone-file": "DNS zone file",
  "dns-zone": "DNS zone file",
  dockerfile: "Docker",
  dot: "DOT (Graphviz)",
  gv: "DOT (Graphviz)",
  ebnf: "EBNF",
  editorconfig: "EditorConfig",
  ejs: "EJS",
  etlua: "Embedded Lua templating",
  erb: "ERB",
  "excel-formula": "Excel Formula",
  xlsx: "Excel Formula",
  xls: "Excel Formula",
  fsharp: "F#",
  "firestore-security-rules": "Firestore security rules",
  ftl: "FreeMarker Template Language",
  gml: "GameMaker Language",
  gamemakerlanguage: "GameMaker Language",
  gap: "GAP (CAS)",
  gcode: "G-code",
  gdscript: "GDScript",
  gedcom: "GEDCOM",
  gettext: "gettext",
  po: "gettext",
  glsl: "GLSL",
  gn: "GN",
  gni: "GN",
  "linker-script": "GNU Linker Script",
  ld: "GNU Linker Script",
  "go-module": "Go module",
  "go-mod": "Go module",
  graphql: "GraphQL",
  hbs: "Handlebars",
  hs: "Haskell",
  hcl: "HCL",
  hlsl: "HLSL",
  http: "HTTP",
  hpkp: "HTTP Public-Key-Pins",
  hsts: "HTTP Strict-Transport-Security",
  ichigojam: "IchigoJam",
  "icu-message-format": "ICU Message Format",
  idr: "Idris",
  ignore: ".ignore",
  gitignore: ".gitignore",
  hgignore: ".hgignore",
  npmignore: ".npmignore",
  inform7: "Inform 7",
  javadoc: "JavaDoc",
  javadoclike: "JavaDoc-like",
  javastacktrace: "Java stack trace",
  jq: "JQ",
  jsdoc: "JSDoc",
  "js-extras": "JS Extras",
  json: "JSON",
  webmanifest: "Web App Manifest",
  json5: "JSON5",
  jsonp: "JSONP",
  jsstacktrace: "JS stack trace",
  "js-templates": "JS Templates",
  keepalived: "Keepalived Configure",
  kts: "Kotlin Script",
  kt: "Kotlin",
  kumir: "KuMir (КуМир)",
  kum: "KuMir (КуМир)",
  latex: "LaTeX",
  tex: "TeX",
  context: "ConTeXt",
  lilypond: "LilyPond",
  ly: "LilyPond",
  emacs: "Lisp",
  elisp: "Lisp",
  "emacs-lisp": "Lisp",
  llvm: "LLVM IR",
  log: "Log file",
  lolcode: "LOLCODE",
  magma: "Magma (CAS)",
  md: "Markdown",
  markdown: "Markdown",
  "markup-templating": "Markup templating",
  matlab: "MATLAB",
  maxscript: "MAXScript",
  mel: "MEL",
  metafont: "METAFONT",
  mongodb: "MongoDB",
  moon: "MoonScript",
  n1ql: "N1QL",
  n4js: "N4JS",
  n4jsd: "N4JS",
  "nand2tetris-hdl": "Nand To Tetris HDL",
  naniscript: "Naninovel Script",
  nani: "Naninovel Script",
  nasm: "NASM",
  neon: "NEON",
  nginx: "nginx",
  nsis: "NSIS",
  objectivec: "Objective-C",
  objc: "Objective-C",
  ocaml: "OCaml",
  opencl: "OpenCL",
  openqasm: "OpenQasm",
  qasm: "OpenQasm",
  parigp: "PARI/GP",
  objectpascal: "Object Pascal",
  psl: "PATROL Scripting Language",
  pcaxis: "PC-Axis",
  px: "PC-Axis",
  peoplecode: "PeopleCode",
  pcode: "PeopleCode",
  php: "PHP",
  phpdoc: "PHPDoc",
  "php-extras": "PHP Extras",
  "plant-uml": "PlantUML",
  plantuml: "PlantUML",
  plsql: "PL/SQL",
  powerquery: "PowerQuery",
  pq: "PowerQuery",
  mscript: "PowerQuery",
  powershell: "PowerShell",
  promql: "PromQL",
  properties: ".properties",
  protobuf: "Protocol Buffers",
  purebasic: "PureBasic",
  pbfasm: "PureBasic",
  purs: "PureScript",
  py: "Python",
  qsharp: "Q#",
  qs: "Q#",
  q: "Q (kdb+ database)",
  qml: "QML",
  rkt: "Racket",
  cshtml: "Razor C#",
  razor: "Razor C#",
  jsx: "React JSX",
  tsx: "React TSX",
  renpy: "Ren'py",
  rpy: "Ren'py",
  res: "ReScript",
  rest: "reST (reStructuredText)",
  robotframework: "Robot Framework",
  robot: "Robot Framework",
  rb: "Ruby",
  sas: "SAS",
  sass: "Sass (Sass)",
  scss: "Sass (SCSS)",
  "shell-session": "Shell session",
  "sh-session": "Shell session",
  shellsession: "Shell session",
  shell: "Shell",
  sh: "Shell",
  sml: "SML",
  smlnj: "SML/NJ",
  solidity: "Solidity (Ethereum)",
  sol: "Solidity (Ethereum)",
  "solution-file": "Solution file",
  sln: "Solution file",
  soy: "Soy (Closure Template)",
  sparql: "SPARQL",
  rq: "SPARQL",
  "splunk-spl": "Splunk SPL",
  sqf: "SQF: Status Quo Function (Arma 3)",
  sql: "SQL",
  stata: "Stata Ado",
  iecst: "Structured Text (IEC 61131-3)",
  supercollider: "SuperCollider",
  sclang: "SuperCollider",
  systemd: "Systemd configuration file",
  "t4-templating": "T4 templating",
  "t4-cs": "T4 Text Templates (C#)",
  t4: "T4 Text Templates (C#)",
  "t4-vb": "T4 Text Templates (VB)",
  tap: "TAP",
  tt2: "Template Toolkit 2",
  toml: "TOML",
  trickle: "trickle",
  troy: "troy",
  trig: "TriG",
  ts: "TypeScript",
  tsconfig: "TSConfig",
  uscript: "UnrealScript",
  uc: "UnrealScript",
  uorazor: "UO Razor Script",
  uri: "URI",
  url: "URL",
  vbnet: "VB.Net",
  vhdl: "VHDL",
  vim: "vim",
  "visual-basic": "Visual Basic",
  vba: "VBA",
  vb: "Visual Basic",
  wasm: "WebAssembly",
  "web-idl": "Web IDL",
  webidl: "Web IDL",
  wgsl: "WGSL",
  wiki: "Wiki markup",
  wolfram: "Wolfram language",
  nb: "Mathematica Notebook",
  wl: "Wolfram language",
  xeoracube: "XeoraCube",
  "xml-doc": "XML doc (.net)",
  xojo: "Xojo (REALbasic)",
  xquery: "XQuery",
  yaml: "YAML",
  yml: "YAML",
  yang: "YANG",
};

//map the given prism language key, like "js", to
//a correctly spelled language name, like "JavaScript"
function resolvePrismLanguage(language) {
  return PRISM_LANGUAGES[language] || language || "";
}
