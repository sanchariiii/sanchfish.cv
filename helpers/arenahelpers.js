export async function getArenaGroup(id) {
  try {
    const response = await fetch(
      `https://api.are.na/v3/groups/${id}/contents?page=1&per=100&type=Channel`,
    );

    if (!response.ok) {
      throw new error(`http ${response.status}`);
    }
    const group = await response.json();

    return group;
  } catch (error) {
    console.error("error fetching are.na group:", error);
  }
}
// get channel
export async function getArenaChannel(id, type) {
  try {
    const response = await fetch(
      `https://api.are.na/v3/channels/${id}${type ? `/${type}?per=100` : ""}`,
    );

    if (!response.ok) {
      throw new error(`http ${response.status}`);
    }
    const group = await response.json();

    return group;
  } catch (error) {
    console.error("error fetching are.na group:", error);
  }
}
export async function getArenaConnect(id) {
  try {
    const response = await fetch(`https://api.are.na/v3/connections/${id}`);

    if (!response.ok) {
      throw new error(`http ${response.status}`);
    }
    const group = await response.json();

    return group;
  } catch (error) {
    console.error("error fetching are.na group:", error);
  }
}
