const User = require('./User');
const blogPost = require('./blogPost');
const Comment = require('./comment');

User.hasMany(blogPost, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

blogPost.belongsTo(User, {
  foreignKey: 'user_id'
});
blogPost.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});


module.exports = { User, blogPost, Comment };
