import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const SellerPostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { post } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // Like handler
  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Add comment
  const handleAddComment = () => {
    if (commentInput.trim() === "") return;
    setComments([...comments, commentInput]);
    setCommentInput("");
  };

  // Save edited post
  const handleSaveEdit = () => {
    setIsEditing(false);
    Alert.alert("Success", "Post updated successfully!");
  };

  // Delete post
  const handleDeletePost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Deleted", "Your post has been deleted.");
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editBtn}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePost}>
            <Text style={styles.deleteBtn}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Image */}
      {editedPost.images && editedPost.images.length > 0 && (
        <Image
          source={{ uri: editedPost.images[0] }}
          style={styles.postImage}
        />
      )}

      {/* Like & Comment Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.icon}>{liked ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>💬</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.likeText}>{likes} likes</Text>

      {/* Post Details */}
      <View style={styles.detailsBox}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editedPost.caption}
              onChangeText={(text) =>
                setEditedPost({ ...editedPost, caption: text })
              }
              placeholder="Edit description..."
              multiline
            />
            <TextInput
              style={styles.input}
              value={editedPost.price}
              onChangeText={(text) =>
                setEditedPost({ ...editedPost, price: text })
              }
              placeholder="Edit price..."
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedPost.color}
              onChangeText={(text) =>
                setEditedPost({ ...editedPost, color: text })
              }
              placeholder="Edit color..."
            />
            <TextInput
              style={styles.input}
              value={editedPost.size}
              onChangeText={(text) =>
                setEditedPost({ ...editedPost, size: text })
              }
              placeholder="Edit size..."
            />
            <TextInput
              style={styles.input}
              value={editedPost.brand}
              onChangeText={(text) =>
                setEditedPost({ ...editedPost, brand: text })
              }
              placeholder="Edit brand..."
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
              <Text style={styles.saveText}>💾 Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.caption}>{editedPost.caption}</Text>
            <Text style={styles.label}>
              Brand: <Text style={styles.value}>{editedPost.brand}</Text>
            </Text>
            <Text style={styles.label}>
              Color: <Text style={styles.value}>{editedPost.color}</Text>
            </Text>
            <Text style={styles.label}>
              Size: <Text style={styles.value}>{editedPost.size}</Text>
            </Text>
            <Text style={styles.label}>
              Price:{" "}
              <Text style={styles.price}>Rs. {editedPost.price}</Text>
            </Text>

            {editedPost.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {editedPost.tags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.date}>
              Posted on {new Date(editedPost.createdAt).toLocaleDateString()}
            </Text>
          </>
        )}
      </View>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Text style={styles.commentHeading}>Comments</Text>
        {comments.length === 0 ? (
          <Text style={styles.noComment}>No comments yet.</Text>
        ) : (
          comments.map((comment, index) => (
            <Text key={index} style={styles.commentText}>
              💬 {comment}
            </Text>
          ))
        )}

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentInput}
            onChangeText={setCommentInput}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleAddComment}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backIcon: { fontSize: 24, color: "#000" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  editBtn: { fontSize: 20 },
  deleteBtn: { fontSize: 20 },
  postImage: { width: "100%", height: 400, resizeMode: "cover" },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  icon: { fontSize: 26 },
  likeText: { fontWeight: "bold", marginLeft: 16, marginBottom: 6 },
  detailsBox: { padding: 16 },
  caption: { fontSize: 16, marginBottom: 10 },
  label: { fontSize: 15, color: "#555", marginTop: 4 },
  value: { color: "#000", fontWeight: "600" },
  price: { color: "#10b981", fontWeight: "700", fontSize: 16 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tagChip: {
    backgroundColor: "#e7f5ff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { color: "#1971c2", fontWeight: "600" },
  date: { color: "#888", fontSize: 13, marginTop: 12 },
  commentSection: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  commentHeading: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  noComment: { color: "#666", fontStyle: "italic" },
  commentText: { fontSize: 14, color: "#333", marginVertical: 2 },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#10b981",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});

export default SellerPostDetailScreen;
