// ../../node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// ../../node_modules/@quartz-community/utils/dist/path.js
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function trimSuffix(s, suffix) {
  if (endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}

// src/styles.scss
var styles_default = `.slim-properties {
  margin: 0.25rem 0 0;
}
.slim-properties > p,
.slim-properties > ul {
  margin: 0 0 0.5rem;
}
.slim-properties .aliases {
  font-size: 1.3rem;
  line-height: 1.3;
  color: var(--gray);
}
.slim-properties .aliases .alias:hover {
  color: var(--darkgray);
}
.slim-properties .aliases .separator {
  color: color-mix(in srgb, var(--gray) 60%, black);
}
.slim-properties .tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-left: 0;
}
.slim-properties .tags > li {
  margin: 0;
  white-space: nowrap;
}
.slim-properties a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
}
.slim-properties .description {
  color: var(--gray);
}
.slim-properties hr {
  margin: 0.75rem 0 0.5rem;
  border: none;
  border-top: 1px solid var(--lightgray);
}`;

// src/index.tsx
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
function toStringList(value) {
  if (value === null || value === void 0) return [];
  const items = Array.isArray(value) ? value : [value];
  return items.map((item) => String(item).trim()).filter((item) => item.length > 0);
}
var SlimProperties = () => {
  const Component = ({ fileData, displayClass }) => {
    const frontmatter = fileData.frontmatter ?? {};
    const slug2 = fileData.slug;
    const description = typeof frontmatter.description === "string" ? frontmatter.description.trim() : "";
    const aliases = toStringList(frontmatter.aliases);
    const tags = toStringList(frontmatter.tags);
    return /* @__PURE__ */ jsxs("div", { class: `slim-properties ${displayClass ?? ""}`, children: [
      aliases.length > 0 && /* @__PURE__ */ jsx("p", { class: "aliases", children: aliases.map((alias, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
        i > 0 && /* @__PURE__ */ jsx("span", { class: "separator", children: ", " }),
        /* @__PURE__ */ jsx("span", { class: "alias", children: alias })
      ] })) }),
      tags.length > 0 && /* @__PURE__ */ jsx("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { class: "internal tag-link", href: resolveRelative(slug2, `tags/${tag}`), children: tag }) })) }),
      description && /* @__PURE__ */ jsx("p", { class: "description", children: description }),
      /* @__PURE__ */ jsx("hr", {})
    ] });
  };
  Component.css = styles_default;
  return Component;
};
export {
  SlimProperties
};
