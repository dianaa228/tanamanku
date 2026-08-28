import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../models/post_model.dart';
import '../../services/community_service.dart';
import '../../features/auth/auth_provider.dart';
import '../../widgets/loading_widget.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({super.key});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  final _service = CommunityService();
  List<PostModel> _posts = [];
  bool _loading = true;
  final _composerCtrl = TextEditingController();
  bool _composerOpen = false;
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    try {
      final posts = await _service.getPosts();
      if (mounted) setState(() { _posts = posts; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _submitPost() async {
    if (_composerCtrl.text.trim().isEmpty) return;
    setState(() => _sending = true);
    try {
      await _service.createPost(_composerCtrl.text.trim());
      _composerCtrl.clear();
      setState(() { _composerOpen = false; _sending = false; });
      _loadPosts();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Post berhasil dibagikan! 🌱')));
    } catch (e) {
      setState(() => _sending = false);
    }
  }

  Future<void> _toggleLike(int postId) async {
    await _service.toggleLike(postId);
    _loadPosts();
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: const Text('Komunitas 💬'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_rounded),
            onPressed: () => setState(() => _composerOpen = !_composerOpen),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadPosts,
        child: Column(
          children: [
            // Composer
            if (_composerOpen)
              Container(
                margin: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.leaf100),
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: _composerCtrl,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Bagikan cerita berkebunmu...',
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        filled: false,
                        hintStyle: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.4)),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Spacer(),
                        TextButton(
                          onPressed: () => setState(() => _composerOpen = false),
                          child: Text('Batal', style: GoogleFonts.poppins(fontSize: 12)),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          onPressed: _sending ? null : _submitPost,
                          child: _sending
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                              : const Text('Bagikan'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

            // Posts
            Expanded(
              child: _loading
                  ? const LoadingWidget()
                  : _posts.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text('💬', style: TextStyle(fontSize: 48)),
                              const SizedBox(height: 12),
                              Text('Belum ada post', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(20),
                          itemCount: _posts.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 16),
                          itemBuilder: (context, i) => _postCard(_posts[i], user?.name),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _postCard(PostModel post, String? currentUserName) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.leaf100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 0),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: AppTheme.leaf100,
                  child: Text(post.user?.avatar ?? '🧑‍🌾', style: const TextStyle(fontSize: 18)),
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(post.user?.name ?? 'Pekebun', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                    Text(
                      AppFormatter.timeAgo(post.createdAt),
                      style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.4)),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 0),
            child: Text(post.content, style: GoogleFonts.poppins(fontSize: 13, height: 1.5)),
          ),

          // Actions
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => _toggleLike(post.id),
                  child: Row(
                    children: [
                      const Text('🤍', style: TextStyle(fontSize: 16)),
                      const SizedBox(width: 4),
                      Text('${post.likesCount}', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Row(
                  children: [
                    const Text('💬', style: TextStyle(fontSize: 16)),
                    const SizedBox(width: 4),
                    Text('${post.commentsCount}', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                  ],
                ),
              ],
            ),
          ),

          // Comments
          if (post.comments.isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(
              color: AppTheme.leaf50.withValues(alpha: 0.5),
              padding: const EdgeInsets.all(12),
              child: Column(
                children: post.comments.take(3).map((c) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundColor: Colors.white,
                        child: Text(c.user?.avatar ?? '🧑‍🌾', style: const TextStyle(fontSize: 10)),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(text: '${c.user?.name ?? ''} ', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.leaf900)),
                              TextSpan(text: c.content, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.7))),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                )).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
