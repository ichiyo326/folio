import React from 'react';

function SidebarExtras() {
  return (
    <div>
      {/* 検索ボックス */}
      <input
        type="text"
        placeholder="スキのサイトを検索"
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <p>スポンサーリンク</p>
      {/* 広告画像例 */}
      <img src="/images/sponsor_ad.png" alt="Ad" style={{ width: '100%' }} />
    </div>
  );
}

export default SidebarExtras;
