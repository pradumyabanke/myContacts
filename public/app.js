let token = "";

const showToast = (msg) => {
  document.getElementById("toast").textContent = msg;
};

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const renderPlans = async () => {
  const plansWrap = document.getElementById("plans");
  const data = await api("/api/subscriptions/plans");
  plansWrap.innerHTML = "";

  data.plans.forEach((plan) => {
    const el = document.createElement("div");
    el.className = "plan";
    el.innerHTML = `
      <h3>${plan.name} - ₹${plan.priceInr}</h3>
      <p>${plan.features.join(" • ")}</p>
      <button data-plan="${plan.code}">Subscribe</button>
    `;

    el.querySelector("button").addEventListener("click", async () => {
      if (!token) {
        showToast("Login first to subscribe");
        return;
      }
      const result = await api("/api/subscriptions/subscribe", {
        method: "POST",
        body: JSON.stringify({ planCode: plan.code }),
      });
      showToast(result.message);
    });

    plansWrap.appendChild(el);
  });
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("regName").value,
      email: document.getElementById("regEmail").value,
      password: document.getElementById("regPassword").value,
    }),
  });
  showToast(`${result.message} DEV OTP: ${result.devOtp}`);
});

document.getElementById("verifyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = await api("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email: document.getElementById("verifyEmail").value,
      otp: document.getElementById("verifyOtp").value,
    }),
  });
  showToast(result.message);
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    }),
  });
  token = result.token;
  showToast(`Welcome ${result.user.name}`);
});

document.getElementById("loadDashboard").addEventListener("click", async () => {
  if (!token) {
    showToast("Login first");
    return;
  }
  const data = await api("/api/dashboard");
  document.getElementById("dashboard").textContent = JSON.stringify(data, null, 2);
});

document.getElementById("loadMatches").addEventListener("click", async () => {
  if (!token) {
    showToast("Login first");
    return;
  }
  const data = await api("/api/matches/live");
  const wrap = document.getElementById("matches");
  wrap.innerHTML = "";

  data.matches.forEach((match) => {
    const el = document.createElement("div");
    el.className = "match";
    el.innerHTML = `<strong>${match.teams}</strong><br/>${match.score} (${match.overs} ov) • ${match.liveStatus}<br/>CRR: ${match.crr} | RRR: ${match.rrr}`;
    wrap.appendChild(el);
  });
});

renderPlans().catch((error) => showToast(error.message));
