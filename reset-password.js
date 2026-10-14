// Password-reset landing page. Supabase redirects here with the recovery session in the
// URL fragment. The token is read once, kept only in this variable (never stored), and
// the fragment is removed from the address bar immediately.
(function () {
  var SUPABASE_URL = "https://jnhlfsgnbskagurrldad.supabase.co";
  // Publishable (public) key — the same one the extension ships with. Not a secret.
  var PUBLISHABLE_KEY = "sb_publishable_5om_kXyQJUE9dGTD8KJY6g_gIApbdvg";

  var $ = function (id) { return document.getElementById(id); };
  var show = function (id) { ["form-view", "done-view", "bad-view"].forEach(function (v) { $(v).hidden = v !== id; }); };

  var params = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  var token = params.get("access_token");
  var type = params.get("type");
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);

  if (!token || type !== "recovery") { show("bad-view"); return; }
  show("form-view");

  function fail(text) { var m = $("msg"); m.textContent = text; m.hidden = false; $("submit").disabled = false; }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    $("msg").hidden = true;
    var a = $("pw").value, b = $("pw2").value;
    if (a.length < 8) return fail("Password must be at least 8 characters.");
    if (a !== b) return fail("The two passwords don't match.");
    $("submit").disabled = true;
    fetch(SUPABASE_URL + "/auth/v1/user", {
      method: "PUT",
      headers: { "apikey": PUBLISHABLE_KEY, "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ password: a })
    }).then(function (res) {
      if (res.ok) { token = null; $("pw").value = ""; $("pw2").value = ""; show("done-view"); return; }
      return res.json().catch(function () { return {}; }).then(function (j) {
        var code = j.error_code || j.code || "";
        if (res.status === 401 || res.status === 403) { token = null; show("bad-view"); }
        else if (code === "same_password") fail("The new password must be different from your old one.");
        else if (code === "weak_password") fail("That password is too weak. Try a longer or less common one.");
        else fail("Couldn't update the password. Please try again.");
      });
    }).catch(function () { fail("Network error. Please check your connection and try again."); });
  });
})();
