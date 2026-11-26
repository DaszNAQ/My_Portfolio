# Admin (Sveltia CMS)
1. Tạo token: GitHub > Settings > Developer settings > Fine-grained tokens.
   Repository access: chỉ repo này. Permissions: Contents = Read and write.
2. Mở https://<user>.github.io/<repo>/admin/ > Sign in with token > dán token.
3. Sửa project > Save. CMS commit vào `main`, GitHub Pages tự deploy lại (~1 phút).
Tái sử dụng: copy thư mục `admin/`, sửa `repo`, `branch`, `file` và `fields` trong config.yml.
