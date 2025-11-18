# 🚀 Quick Fix - Doctor Login (30 Seconds)

## The Problem
Getting "Invalid login credentials" when trying to log in.

## The Solution
**The test doctor user doesn't exist in Supabase.**

## Fix It Now (5 Steps)

1. **Open**: https://supabase.com/dashboard
2. **Go to**: Authentication → Users
3. **Click**: "Add user"
4. **Enter**:
   - Email: `testdoctor@demo.com`
   - Password: `Test123!`
   - ✅ **Check "Auto Confirm User"**
5. **Click**: "Create user"

## Test It

1. Open: http://localhost:5173/login
2. Email: `testdoctor@demo.com`
3. Password: `Test123!`
4. Click "Sign In"

**Done!** You should be redirected to the dashboard.

---

## Still Not Working?

1. **Open**: `test-login-connection.html` in browser
2. **Click**: "Test Login"
3. **Check**: Error message
4. **Read**: `LOGIN_FIX_GUIDE.md` for detailed troubleshooting

---

## Your Code is Perfect ✅

- ✅ Authentication code is correct
- ✅ Environment variables are correct
- ✅ Supabase client is configured correctly
- ❌ Just missing the user account!

**Create the user and you're done!**
