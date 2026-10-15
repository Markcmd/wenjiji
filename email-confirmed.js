// Shows success or an error for the Supabase confirmation redirect, then removes the
// URL fragment so no sign-in token stays in the address bar or browser history.
(function () {
  var params = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  var err = params.get("error_code") || params.get("error");
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  if (err) {
    document.getElementById("ok").hidden = true;
    document.getElementById("bad").hidden = false;
    if (err === "otp_expired") {
      document.getElementById("bad-msg").textContent = "This link has expired or was already used.";
    }
  }
})();
