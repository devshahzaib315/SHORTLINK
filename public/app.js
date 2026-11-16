const $ = (id) => document.getElementById(id);

$("make").addEventListener("click", async () => {
  const url = $("url").value.trim();
  $("msg").textContent = "Creating…";
  $("make").disabled = true;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only http and https links are supported.");
    const response = await fetch("/api/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: parsed.href })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not create link.");
    $("short").value = data.shortUrl;
    $("result").hidden = false;
    $("msg").textContent = "Link created successfully.";
  } catch (error) {
    $("msg").textContent = error.message || "Something went wrong.";
  } finally {
    $("make").disabled = false;
  }
});

$("copy").addEventListener("click", async () => {
  const value = $("short").value;
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
    else {
      $("short").focus(); $("short").select();
      if (!document.execCommand("copy")) throw new Error("Copy not supported");
    }
    $("copy").textContent = "Copied";
  } catch {
    $("msg").textContent = "Copy failed. Please copy the link manually.";
  }
});
