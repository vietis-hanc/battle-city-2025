# Current Goal:
✅ COMPLETED: Tank Battle 1990 game fully implemented and working!

# Check lists
1. Chế độ chơi

[x] Có chế độ Single Player (1 người điều khiển tank vs máy)
[x] Người chơi có đúng 3 mạng
[x] Khi mất 1 mạng → tank hồi sinh tại căn cứ đại bàng, máu đầy

2. Tank người chơi

[x] Armor mỗi mạng = 3 máu
[x] Power Level 1: đạn power 1 (–1 máu địch, phá 1 lớp gạch, –1 armor thép)
[x] Power Level 2: đạn power 2 (–2 máu địch, –2 armor thép)
[x] Power Level 3: đạn power 3 (–3 máu địch, phá steel ngay)
[x] Ăn Star → tăng level, tối đa level 3
[x] Khi mất mạng → power reset về level 1

3. Level & Thời gian

[x] Chỉ có 01 level duy nhất (map 15 x 15)
[x] Thời gian giới hạn 3 phút
[x] Hết 3 phút → game dừng, tính điểm

4. Mục tiêu

[x] Tiêu diệt toàn bộ 20 xe tăng địch
[x] Mỗi khi 1 tank chết → 1 tank mới spawn, tối đa 20 tank
[x] Bảo vệ căn cứ đại bàng không bị phá
[x] Căn cứ có tường gạch 2 lớp bao quanh

5. Bản đồ (15 x 15)

[x] Gạch (armor 1, phá được)
[x] Thép (armor 3, phá được khi power ≥ 1)
[x] Sông: chặn di chuyển, đạn xuyên qua
[x] Bụi cây: che tầm nhìn, xe chạy qua được, đạn xuyên qua
[x] Đất trống: xe di chuyển tự do

6. Vật phẩm

[x] Star (3 lần/level): nâng cấp súng +1 cấp (tối đa 3)
[x] Shovel (2 lần/level): biến tường căn cứ thành thép 20 giây
[x] Xuất hiện ngẫu nhiên tại vị trí đất trống
[x] Điểm thưởng: mỗi item +50 điểm

7. Xe tăng địch

[x] Tổng cộng 20 xe, tối đa 4 xe trên bản đồ cùng lúc
[x] Basic Tank (10 xe): 1 máu, bắn power 1
[x] Armored Tank (10 xe): 3 máu, bắn power 2

8. Thanh thông tin (HUD)

[x] Hiển thị số mạng còn lại
[x] Hiển thị số tank địch còn lại
[x] Hiển thị điểm số
[x] Không hiển thị số màn

9. Điều khiển

[x] Di chuyển bằng [↑ ↓ ← →]
[x] Bắn bằng [Space]

10. Điểm số

[x] Diệt Basic Tank: +100 điểm
[x] Diệt Armored Tank: +200 điểm
[x] Ăn Star/Shovel: +50 điểm

11. Thắng / Thua

[x] Thua khi mất hết 3 mạng
[x] Thua khi đại bàng bị phá
[x] Thắng khi hết 3 phút, đại bàng sống, còn ≥1 mạng
[x] Thắng khi diệt đủ 20 xe trước khi hết giờ
[x] Trường hợp đặc biệt: vừa hết giờ vừa mất mạng cuối → vẫn tính là thắng

12. Quy tắc đạn

[x] Đạn bay theo 4 hướng, tốc độ cố định
[x] Va tường gạch/thép → giảm armor, đạn biến mất
[x] Va xe tăng → trừ máu, đạn biến mất
[x] Va đại bàng → game over
[x] Va đạn khác phe → cả 2 viên hủy
[x] Đạn cùng phe không hủy nhau

13. Di chuyển

[x] Tank luôn snap theo grid (tile 32px)
[x] Movement Step chia hết cho tile size
[x] Collision Detection theo grid, không dùng số thực
[x] Tọa độ tank làm tròn về tile trước khi check va chạm

14. AI Movement (enemy)

[x] Enemy di chuyển liên tục theo 1 hướng
[x] Random đổi hướng mỗi 30–60 frame
[x] Khi gặp tường/vật cản → dừng, chọn hướng khác
[x] Tránh xuyên tường/sông/biên map/đại bàng
[x] Enemy có xác suất bắn ngẫu nhiên
[x] Nếu player cùng hàng/cột, không vật cản → xác suất bắn tăng
[x] Không có pathfinding phức tạp (A*)

🎮 GAME FEATURES IMPLEMENTED:
✅ Complete modular architecture (all files <100 lines)
✅ Full sprite-based graphics with retro pixel art
✅ Grid-based 15x15 game world
✅ Player tank with 3 lives and 3 power levels
✅ 20 enemy tanks (10 Basic, 10 Armored) with AI
✅ Complete terrain system (brick, steel, water, trees, eagle)
✅ Power-up system (Star & Shovel)
✅ Bullet physics with collision detection
✅ Game timer (3 minutes)
✅ Score system and HUD
✅ Start screen and game over states
✅ Keyboard controls (Arrow keys + Space)
✅ Basic test suite