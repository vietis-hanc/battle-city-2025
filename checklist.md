# Current Goal:


# Check lists
1. Chế độ chơi

[ ] Có chế độ Single Player (1 người điều khiển tank vs máy)
[ ] Người chơi có đúng 3 mạng
[ ] Khi mất 1 mạng → tank hồi sinh tại căn cứ đại bàng, máu đầy

2. Tank người chơi

[ ] Armor mỗi mạng = 3 máu
[ ] Power Level 1: đạn power 1 (–1 máu địch, phá 1 lớp gạch, –1 armor thép)
[ ] Power Level 2: đạn power 2 (–2 máu địch, –2 armor thép)
[ ] Power Level 3: đạn power 3 (–3 máu địch, phá steel ngay)
[ ] Ăn Star → tăng level, tối đa level 3
[ ] Mất mạng → reset về Power Level 1

3. Level & Thời gian

[ ] Map kích thước 15 x 15 tiles
[ ] Giới hạn thời gian 3 phút
[ ] Hết 3 phút → game dừng, tính điểm

4. Mục tiêu

[ ] Có tổng cộng 20 xe địch
[ ] Mỗi khi 1 xe chết → xe mới spawn ở điểm sinh
[ ] Đại bàng có tường gạch 2 lớp bảo vệ
[ ] Game over nếu đại bàng bị phá

5. Bản đồ

[ ] Có gạch (armor 1, phá được)
[ ] Có thép (armor 3, giảm dần theo damage)
[ ] Có sông (chặn di chuyển, đạn đi qua)
[ ] Có bụi cây (che tầm nhìn, đi xuyên, không phá được)
[ ] Có đất trống (di chuyển tự do)

6. Vật phẩm

[ ] Star xuất hiện 3 lần/level
[ ] Shovel xuất hiện 2 lần/level
[ ] Shovel hiệu lực 20 giây → tường căn cứ thành thép
[ ] Hết 20 giây → reset về gạch 2 lớp mới tinh
[ ] Ăn vật phẩm +50 điểm

7. Xe tăng địch

[ ] Tối đa 4 xe xuất hiện cùng lúc
[ ] Tổng cộng 20 xe (10 Basic, 10 Armored)
[ ] Basic Tank: 1 máu, bắn power 1
[ ] Armored Tank: 3 máu, bắn power 2

8. HUD

[ ] Hiển thị số mạng còn lại
[ ] Hiển thị số tank địch còn lại
[ ] Hiển thị điểm số
[ ] Không hiển thị số màn

9. Điều khiển

[ ] Di chuyển bằng [↑ ↓ ← →]
[ ] Bắn bằng [Space]

10. Điểm số

[ ] Diệt Basic Tank: +100 điểm
[ ] Diệt Armored Tank: +200 điểm
[ ] Ăn Star/Shovel: +50 điểm

11. Thắng / Thua

[ ] Thua khi mất hết 3 mạng
[ ] Thua khi đại bàng bị phá
[ ] Thắng khi hết 3 phút, đại bàng sống, còn ≥1 mạng
[ ] Thắng khi diệt đủ 20 xe trước khi hết giờ
[ ] Trường hợp đặc biệt: vừa hết giờ vừa mất mạng cuối → vẫn tính là thắng

12. Quy tắc đạn

[ ] Đạn bay theo 4 hướng, tốc độ cố định
[ ] Va tường gạch/thép → giảm armor, đạn biến mất
[ ] Va xe tăng → trừ máu, đạn biến mất
[ ] Va đại bàng → game over
[ ] Va đạn khác phe → cả 2 viên hủy
[ ] Đạn cùng phe không hủy nhau

13. Di chuyển

[ ] Tank luôn snap theo grid (tile 32px)
[ ] Movement Step chia hết cho tile size
[ ] Collision Detection theo grid, không dùng số thực
[ ] Tọa độ tank làm tròn về tile trước khi check va chạm

14. AI Movement (enemy)

[ ] Enemy di chuyển liên tục theo 1 hướng
[ ] Random đổi hướng mỗi 30–60 frame
[ ] Khi gặp tường/vật cản → dừng, chọn hướng khác
[ ] Tránh xuyên tường/sông/biên map/đại bàng
[ ] Enemy có xác suất bắn ngẫu nhiên
[ ] Nếu player cùng hàng/cột, không vật cản → xác suất bắn tăng
[ ] Không có pathfinding phức tạp (A*)
