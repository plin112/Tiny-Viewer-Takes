import { Router } from "express";
import { userData } from "../data/index.js";
import validation from "../data/validation.js";

const router = Router();

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
  }
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  let { firstNameInput, lastNameInput, emailAddressInput, passwordInput } =
    req.body;

  try {
    firstNameInput = validation.validateString(firstNameInput, "First Name");
    lastNameInput = validation.validateString(lastNameInput, "Last Name");
    emailAddressInput = validation.validateString(emailAddressInput);
    passwordInput = validation.validateString(passwordInput);

    const result = await userData.registerUser(
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput
    );

    // console.log(result);
    // if (result.userInserted) {
    //   return res.redirect("/login");
    // } else {
    //   throw new Error("Unexpected error occurred during registration.");
    // }

    return res.redirect("/login");
  } catch (e) {
    return res.status(400).render("register", {
      error: e.toString(),
      title: "Register",
      data: req.body,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
  }
  res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  let { emailAddressInput, passwordInput } = req.body;

  try {
    validation.checkEmail(emailAddressInput);
    validation.checkPassword(passwordInput);
    const user = await userData.loginUser(emailAddressInput, passwordInput);

    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    };
    res.redirect("/channels");
  } catch (e) {
    return res.status(400).render("login", {
      error: "Invalid email address or password.",
      title: "Login",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
