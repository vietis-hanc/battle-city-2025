
## Technology Stack
Html, Css, Javascript
Dùng fonts, images ở thư mục để tạo giao diện cho game.
Chia nhỏ thành các phần riêng biệt, chia nhỏ file nhất có thể.
File chính chạy game.html
# Ghi lại tiến trình ở file checklist.md
1. Ghi tính năng đang làm vào # Current Goal:
2. Ghi tính năng đã làm vào phần # Check lists


# Yêu cầu
Mỗi file không được dài quá 100 dòng. Nếu quá 100 dòng, hãy chia nhỏ thành các file riêng biệt.

# Thực hiện unit test để đảm bảo đúng spec.

# spec của game
Game Design Document – Tank Battle 1990 - VietIS AI Challenge 2025

1. Chế độ chơi

Single Player: Người chơi điều khiển tank đối đầu với máy.

Mạng: Người chơi có 03 mạng.

Khi mất 1 mạng → tank hồi sinh tại căn cứ đại bàng, máu đầy.

2. Tank người chơi

Armor (máu): 3 máu mỗi mạng.

Power (súng):

Cấp 1 (mặc định): bắn đạn power 1 (gây -1 máu/tank địch, phá 1 lớp gạch, giảm 1 armor của thép).

Ăn Star để nâng cấp:

Cấp 2: đạn power 2 (-2 máu địch, phá 2 armor thép/viên).

Cấp 3: đạn power 3 (-3 máu địch, phá steel ngay 1 phát).

Khi mất mạng → power reset về cấp 1.

3. Level & Thời gian

Chỉ có 01 level duy nhất (map 15 x 15).

Thời gian giới hạn: 3 phút.

Hết 3 phút → game dừng, tính điểm.

4. Mục tiêu

Tiêu diệt toàn bộ 20 xe tăng địch trong thời gian chơi.

Mỗi khi 1 tank chết → 1 tank mới spawn ở điểm xuất phát, cho đến khi đủ 20 tank.

Bảo vệ căn cứ (đại bàng) không để bị phá.

Căn cứ mặc định có tường gạch 2 lớp bao quanh.

5. Bản đồ (15 x 15)

Địa hình:

Gạch (armor 1, phá được).

Thép (armor 3, chỉ phá được khi power ≥ 1, mất dần theo damage).

Sông: chặn di chuyển, đạn xuyên qua.

Bụi cây: che tầm nhìn, xe chạy qua được, đạn xuyên qua, không phá được.

Đất trống: xe di chuyển tự do.

6. Vật phẩm

Xuất hiện ngẫu nhiên trên bản đồ tại vị trí đất trống.

Star (3 lần/level): nâng cấp súng thêm 1 cấp (tối đa cấp 3).

Shovel (2 lần/level): biến tường căn cứ thành thép trong 20 giây.

Hết 20 giây → trả về tường gạch 2 lớp mới tinh, kể cả khi trước đó bị phá hỏng.

Điểm thưởng: mỗi item +50 điểm.

7. Xe tăng địch

Xuất hiện tổng cộng 20 xe, tối đa 4 xe trên bản đồ cùng lúc.

Loại địch:

Basic Tank (10 xe): 1 máu, bắn power 1.

Armored Tank (10 xe): 3 máu, bắn power 2.

8. Thanh thông tin (HUD)

Hiển thị:

Mạng còn lại.

Số tank địch còn lại.

Điểm số hiện tại.

Không hiển thị số màn, vì game chỉ có 1 level duy nhất.

9. Điều khiển

Di chuyển: Arrow Keys [↑ ↓ ← →]

Bắn: [Space]

10. Điểm số

Tiêu diệt Basic Tank: +100 điểm.

Tiêu diệt Armored Tank: +200 điểm.

Ăn Star/Shovel: +50 điểm.

11. Thắng / Thua

Thua khi:

Mất hết 3 mạng.

Đại bàng bị phá.

Thắng khi:

Hết 3 phút, đại bàng còn sống, người chơi còn ít nhất 1 mạng.

Tiêu diệt đủ 20 xe tăng địch trước khi hết 3 phút (win sớm).

Nếu vừa hết giờ vừa mất mạng cuối cùng → tính là thắng (timeout).


13. Quy tắc đạn

Đạn có tốc độ bay cố định, đi theo 4 hướng.

Đạn bị hủy trong các trường hợp:

Va vào tường gạch/thép → giảm armor của tường và đạn biến mất.

Va vào xe tăng → trừ armor xe, đạn biến mất.

Va vào đại bàng → game over.

Va chạm đạn khác phe → cả 2 viên đạn bị hủy.

Đạn cùng phe không hủy nhau.


# di chuyển
Đảm bảo tank luôn thẳng hàng với tile,snap theo grid
Movement Step (bước di chuyển) luôn chia hết cho tile size (32px).
Collision Detection luôn tính theo grid chứ không dùng số thực.

Tọa độ tank được làm tròn về tile trước khi kiểm tra va chạm.

# Logic di chuyển (AI Movement)

enemy tank AI có logic như sau:

Di chuyển liên tục theo một hướng (trái, phải, lên, xuống).

Random đổi hướng:

Mỗi một khoảng thời gian ngắn (ví dụ mỗi 30–60 frame), game tung số ngẫu nhiên → enemy có thể đổi hướng.

Thường đổi hướng khi chạm tường hoặc vật cản.

Tránh đi xuyên tường:

Khi gặp vật cản (brick, steel, water, map border, Eagle) → enemy dừng lại, rồi chọn hướng khác (thường là trái hoặc phải nếu đang đi lên/xuống, và ngược lại).

Bắn đạn:

Enemy có xác suất tự bắn (random).

Nếu player đứng cùng hàng/cột và không có chướng ngại, xác suất bắn tăng cao hơn.

Đi thẳng theo hướng hiện tại.

Đổi hướng khi bị chặn hoặc khi random trigger.

Bắn ngẫu nhiên, tăng xác suất nếu nhìn thấy player.

Không có pathfinding A* hay gì phức tạp.
