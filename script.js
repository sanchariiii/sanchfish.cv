/* -------------------------------------------
to do:
[x] fix fetching year and description
[x] fix the projets filtering system
[] adding the loading animation
[x] fix the differnt views css
[x] fix scroll bar
[] fix mouse cursor
[] fix the media stuff
[x] add year to the projects
 [] figure out the gallery
//,.-------------------------------------------*/
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
// ,, vars
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
import { renderGrid } from "./helpers/views.js";
import { renderAxis } from "./helpers/views.js";
import { getArenaGroup } from "./helpers/arenahelpers.js";
import { getArenaChannel } from "./helpers/arenahelpers.js";
let groupId = "sanchfish-cat";
let orderId = "order-list-table";
let projects,
  tags = [];
let activeFilter;
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
// ,, fecth all projects
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
init();
async function init() {
  const mainContainer = document.querySelector(".main--container");
  let groupData = await getArenaGroup(groupId);
  let orderData = await getArenaChannel(orderId, "contents");
  await getAllTags(groupData.data);
  projects = await mapProjects(orderData, "project");
  console.log(orderData.data);
  console.log(groupData.data);
  console.log(tags);
  // generateProjects();
  generateFilters();
  renderGrid(projects, mainContainer);
  // addViewEvents();
  // generateEventListners();
  console.log(projects);
}
function addViewEvents() {
  const mainContainer = document.querySelector(".main--container");
  let tempViews = document.querySelectorAll(".view__btn");
  tempViews.forEach((v) => {
    v.addEventListener("click", (e) => {
      const b = document.querySelector(".projects--container");
      b.remove();
      if (v.id === "view-grid") {
        renderGrid(projects, mainContainer);
      } else if (v.id === "view-axis") {
        renderAxis(projects, mainContainer);
      }
      tempViews.forEach((e) => {
        e.classList.remove("active");
      });
      v.classList.add("active");
    });
  });
}
/* -------------------------------------------
__ filtering stuff
//,,-------------------------------------------*/
function generateFilters() {
  let filterContainer = document.querySelector(".filters--container");
  tags.forEach((t, index) => {
    if (index == 0) {
      let tempbtn = createFromHTML(
        `<button data-type="all" class="filter__btn active">All</button>`,
      );
      filterContainer.append(tempbtn);
      addFilterEvent(tempbtn);
    }
    let tempbtn = createFromHTML(
      `<button data-type="${t.name}" class="filter__btn">${t.name}</button>`,
    );
    filterContainer.append(tempbtn);
    addFilterEvent(tempbtn);
  });
}
function addFilterEvent(filter) {
  filter.addEventListener("click", (e) => {
    activeFilter = e.target.dataset.type;
    updateFilter();
    e.target.classList.add("active");
    updateFilteredP();
  });
  function updateFilter() {
    const filters = document.querySelectorAll(".filter__btn");
    filters.forEach((f) => f.classList.remove("active"));
  }
  function updateFilteredP() {
    projects.forEach((p) => {
      if (activeFilter != "all")
        p.tags.includes(activeFilter)
          ? (p.el.style.display = "")
          : (p.el.style.display = "none");
      else p.el.style.display = "";
    });
  }
}
/* -------------------------------------------
,, data parseing helpers
//-------------------------------------------*/
async function mapProjects(res, cFilter) {
  return Promise.all(
    res.data
      .filter((item) => item.title.includes(cFilter))
      .map(async (item) => {
        return {
          title: item.title.replace(/^\[project\]\s*/i, ""),
          slug: item.slug,
          id: item.id,
          tags: checkTags(item.id),
          ...(await getChannelinfo(item.slug)),
        };
      }),
  );
}
function getChannelBlock(slug, conv) {}
function checkTags(id) {
  let tempT = [];
  for (let t of tags) {
    if (t.connectIds.includes(id)) tempT.push(t.name);
  }
  return tempT;
}
//get all the tags with the projects that they have
async function getAllTags(res) {
  for (let b of res) {
    if (b.title.includes("(tag)")) {
      let r = await getArenaChannel(b.slug, "contents");
      let temp = {
        name: b.title.replace(/^\(tag\)\s*/i, ""),
        connectIds: r.data.map((c) => c.id),
      };
      tags.push(temp);
    }
  }
  res.forEach((b) => {});
}

//thumbnail for the project
async function getChannelinfo(slug) {
  const tempData = await getArenaChannel(slug, "contents");
  const firstImage = tempData.data.find((item) => item.type === "Image");
  const images = tempData.data
    .filter((i) => i.type === "Image")
    .map((item) => item.image.src);
  const imagesSmall = tempData.data
    .filter((i) => i.type === "Image")
    .map((item) => item.image.small.src);
  const media = tempData.data
    .filter((i) => i.type === "Attachment")
    .map((item) => item.attachment.url);
  const descBlock = tempData.data.find((i) => i.title === ".desc");
  const dateBlock = tempData.data.find((i) => i.title === ".deets");
  //   console.log(firstImage);
  const lines = dateBlock ? dateBlock.content.plain.trim().split("\n") : "null";
  const mediums = lines.slice(0, -1);
  const year = lines.at(-1);
  return {
    thumbnail: firstImage.image.src,
    description: descBlock ? descBlock.content.plain : "null",
    mediums: mediums,
    descriptionE: descBlock ? descBlock.content.html : "null",
    year: year,
    images: images,
    imagesSmall: imagesSmall,
    media: media,
  };
}
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
// ,,general helpers
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
function createFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
// ,, are.na helpers
// ————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————
// async function getArenaGroup(id) {
//   try {
//     const response = await fetch(
//       `https://api.are.na/v3/groups/${id}/contents?page=1&per=100&type=Channel`,
//     );

//     if (!response.ok) {
//       throw new error(`http ${response.status}`);
//     }
//     const group = await response.json();

//     return group;
//   } catch (error) {
//     console.error("error fetching are.na group:", error);
//   }
// }
// // get channel
// async function getArenaChannel(id, type) {
//   try {
//     const response = await fetch(
//       `https://api.are.na/v3/channels/${id}${type ? `/${type}?per=100` : ""}`,
//     );

//     if (!response.ok) {
//       throw new error(`http ${response.status}`);
//     }
//     const group = await response.json();

//     return group;
//   } catch (error) {
//     console.error("error fetching are.na group:", error);
//   }
// }
// async function getArenaConnect(id) {
//   try {
//     const response = await fetch(`https://api.are.na/v3/connections/${id}`);

//     if (!response.ok) {
//       throw new error(`http ${response.status}`);
//     }
//     const group = await response.json();

//     return group;
//   } catch (error) {
//     console.error("error fetching are.na group:", error);
//   }
// }
