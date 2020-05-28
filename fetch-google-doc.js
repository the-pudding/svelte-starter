const fs = require("fs");
const archieml = require("archieml");
const request = require("request");
const htmlparser = require("htmlparser2");
const url = require("url");
const Entities = require("html-entities").AllHtmlEntities;

const CWD = process.cwd();
const CONFIG = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const { doc } = CONFIG.google;

function getHTML(id) {
  return new Promise((resolve, reject) => {
    const docUrl = `https://docs.google.com/document/d/${id}/export?format=html`;
    request(docUrl, (error, response, body) => {
      if (error) reject(error);
      else if (response) resolve(body);
      else reject("no response");
    });
  });
}

function parseHTML(html) {
  let parsed = {};
  let boldClass = "";
  let italicClass = "";
  let underlineClass = "";

  const handler = new htmlparser.DomHandler((error, dom) => {
    const tagHandlers = {
      _base: function (tag) {
        let str = "";
        tag.children.forEach(function (child) {
          if ((func = tagHandlers[child.name || child.type])) {
            let text = func(child);
            const tags = {
              [boldClass]: "strong",
              [italicClass]: "em",
            };
            const tag = tags[child.attribs && child.attribs.class];
            if (tag) {
              text = `<${tag}>${text}</${tag}>`;
            }
            str += text;
          }
        });
        return str;
      },
      text: function (textTag) {
        return textTag.data;
      },
      span: function (spanTag) {
        return tagHandlers._base(spanTag);
      },
      h: function (hTag) {
        return tagHandlers._base(hTag);
      },
      p: function (pTag) {
        return tagHandlers._base(pTag) + "\n";
      },
      a: function (aTag) {
        let href = aTag.attribs.href;
        if (href === undefined) return "";

        // extract real URLs from Google's tracking
        // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
        // to: http://www.nytimes.com...
        if (
          aTag.attribs.href &&
          url.parse(aTag.attribs.href, true).query &&
          url.parse(aTag.attribs.href, true).query.q
        ) {
          href = url.parse(aTag.attribs.href, true).query.q;
        }

        let str = `<a href='${href}'>`;
        str += tagHandlers._base(aTag);
        str += "</a>";
        return str;
      },
      li: function (tag) {
        return "* " + tagHandlers._base(tag) + "\n";
      },
    };

    ["ul", "ol"].forEach(function (tag) {
      tagHandlers[tag] = tagHandlers.span;
    });

    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (tag) {
      tagHandlers[tag] = tagHandlers.h;
    });

    let body = dom[0].children[1];

    try {
      const styleString = body.prev.children[1].children[0].data;
      const rules = styleString.split(/[\.\{\}]/g);
      const boldRuleIndex = rules.findIndex((str) =>
        str.includes("font-weight:700")
      );
      boldClass = rules[boldRuleIndex - 1] || "bold";
      const italicRuleIndex = rules.findIndex((str) =>
        str.includes("font-style:italic")
      );
      italicClass = rules[italicRuleIndex - 1] || "italic";
    } catch (err) {
      return Promise.reject(err);
    }

    let parsedText = tagHandlers._base(body);

    // Convert html entities into the characters as they exist in the google doc
    let entities = new Entities();
    parsedText = entities.decode(parsedText);

    // Remove smart quotes from inside tags
    parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
      return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
    });

    let rawObject = archieml.load(parsedText);

    Object.values(rawObject).forEach((values) => {
      if (!values.forEach) return;
      values.forEach((d) => {
        if (d.type != "text" || !d.value.startsWith("# ")) return;
        d.type = "headline";
        d.value = d.value.slice(2);
      });
    });

    parsed = rawObject;
  });

  const parser = new htmlparser.Parser(handler);

  parser.write(html);
  parser.done();

  return Promise.resolve(parsed);
}

function writeToFile({ data, filepath }) {
  try {
    const str = JSON.stringify(data);
    const file = `${CWD}/${filepath || "src/data/copy.json"}`;
    fs.writeFileSync(file, str);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

async function init() {
  for (d of doc) {
    const { id, filepath } = d;
    if (id) {
      const html = await getHTML(id);
      const data = await parseHTML(html);
      await writeToFile({ data, filepath });
    }
  }
  process.exit();
}

init();
