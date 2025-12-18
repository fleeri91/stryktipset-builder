export default defineEventHandler({
  handler: async (event) => {
    return User.find();
  },
});
