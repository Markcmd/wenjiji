// Supabase sends users to the site root after an email link, with the result in the URL
// fragment. Forward them (fragment included) to the page that handles that result.
// The target page reads and removes the fragment; nothing is stored here.
(function () {
  var h = location.hash || "";
  if (!h) return;
  var p = new URLSearchParams(h.replace(/^#/, ""));
  var t = p.get("type");
  var target = null;
  if (t === "recovery") target = "reset-password.html";
  else if (t === "signup" || t === "email_change" || t === "invite" || t === "magiclink") target = "email-confirmed.html";
  else if (p.get("error") || p.get("error_code")) target = "email-confirmed.html";
  if (target) location.replace(target + h);
})();
