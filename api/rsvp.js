const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method" });
  }

  try {
    const b = req.body || {};

    const name = String(b.name || "").trim().slice(0, 60);
    const count = parseInt(b.count, 10);
    const id = String(b.id || "");
    const lang = b.lang === "en" ? "en" : "fa";

    if (
      !name ||
      !(count >= 1 && count <= 3) ||
      !UUID.test(id)
    ) {
      return res.status(400).json({ error: "invalid" });
    }

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw83xSSP5IdR3TEUBOak8JFiYjX-kJA_66V6NaBRsZSfVgNMGopeSDi61QTn7OMf84PUg/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id,
          name: name,
          count: count,
          lang: lang
        })
      }
    );

    const result = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "google_sheets",
        details: result
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "server",
      details: error.message
    });
  }
};
