/**
 * ホームセンターECのモックカタログ。
 * 実データベースの代わりに静的データで商品・カテゴリを提供する。
 */

export type Category = {
  slug: string;
  name: string;
  /** ナビ・プレースホルダ画像で使う絵文字 */
  emoji: string;
  /** テーマカラー（プレースホルダ画像・アクセント） */
  color: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string; // Category.slug
  /** サブカテゴリ名（商品名から自動分類） */
  sub: string;
  /** 税込価格（円） */
  price: number;
  /** セール割引率（%）。0はセールなし */
  off: number;
  rating: number; // 0-5
  reviews: number;
  stock: number;
  /** ランキング掲載順位（1-上位）。undefinedは圏外 */
  rank?: number;
  isNew?: boolean;
  description: string;
  specs: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "tools", name: "DIY・電動工具", emoji: "🛠️", color: "#e8631a", blurb: "電動ドライバー・のこぎり・作業道具" },
  { slug: "hardware", name: "金物・建材", emoji: "🔩", color: "#5b6470", blurb: "ネジ・ボルト・金具・木材・建材" },
  { slug: "paint", name: "塗料・接着・補修", emoji: "🎨", color: "#2f8f5b", blurb: "ペンキ・刷毛・接着剤・補修材" },
  { slug: "garden", name: "園芸・エクステリア", emoji: "🌱", color: "#4a9e3f", blurb: "土・肥料・鉢・園芸道具・物置" },
  { slug: "car", name: "カー・自転車用品", emoji: "🚗", color: "#2b6cb0", blurb: "洗車・オイル・タイヤ・自転車" },
  { slug: "cleaning", name: "掃除・洗濯・衛生", emoji: "🧹", color: "#3aa6a6", blurb: "洗剤・掃除道具・除菌・消耗品" },
  { slug: "kitchen", name: "キッチン・調理", emoji: "🍳", color: "#d1495b", blurb: "調理器具・保存容器・食器" },
  { slug: "storage", name: "収納・家具・インテリア", emoji: "🗄️", color: "#8a6d3b", blurb: "収納ケース・棚・チェア・照明" },
  { slug: "pet", name: "ペット用品", emoji: "🐾", color: "#c56cf0", blurb: "フード・トイレ・ケージ・おもちゃ" },
  { slug: "safety", name: "作業服・安全用品", emoji: "🦺", color: "#e0a200", blurb: "作業着・手袋・保護具・長靴" },
  { slug: "electric", name: "家電・照明・電材", emoji: "💡", color: "#7048e8", blurb: "LED・延長コード・扇風機・電池" },
  { slug: "daily", name: "日用品・防災", emoji: "🧺", color: "#c05a2e", blurb: "紙製品・防災グッズ・アウトドア" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** 商品定義（税込価格を直接指定。sub/idは後付け） */
const RAW: Omit<Product, "id" | "sub">[] = [
  // --- tools ---
  { name: "18V 充電式インパクトドライバー 本体+バッテリー2個", brand: "HAYAKEN PRO", category: "tools", price: 12800, off: 15, rating: 4.6, reviews: 342, stock: 24, rank: 1, description: "ハイパワー18Vのブラシレスモーター搭載。バッテリー2個・充電器・ケース付きですぐに作業を始められます。DIYからプロの現場まで対応する定番モデル。", specs: ["電圧: 18V", "最大トルク: 165N·m", "バッテリー: 2.0Ah × 2", "充電時間: 約40分", "質量: 1.4kg"] },
  { name: "電動ドライバー 家庭用 コンパクト USB充電", brand: "DIY LABO", category: "tools", price: 3480, off: 0, rating: 4.3, reviews: 128, stock: 60, isNew: true, description: "手のひらサイズで家具の組み立てに最適。USB充電式で電池交換不要。正逆転・LEDライト付き。", specs: ["電圧: 3.6V", "USB Type-C充電", "ビット10本付属", "LEDライト搭載"] },
  { name: "ドライバービットセット 40本組 収納ケース付", brand: "HAYAKEN PRO", category: "tools", price: 1280, off: 0, rating: 4.5, reviews: 210, stock: 120, description: "プラス・マイナス・トルクス・六角など40本を1ケースに。電動・手動どちらにも対応。", specs: ["40本組", "S2合金鋼", "マグネット対応", "収納ケース付"] },
  { name: "折りたたみ式ワークベンチ 耐荷重150kg", brand: "WORKMATE", category: "tools", price: 6980, off: 20, rating: 4.4, reviews: 87, stock: 4, rank: 6, description: "クランプ機能付きの作業台。折りたためば厚さ12cmで収納可能。屋外DIYの必需品。", specs: ["耐荷重: 150kg", "天板: 600×300mm", "折りたたみ厚: 12cm", "高さ2段階調整"] },
  { name: "レーザー距離計 40m デジタル測定", brand: "MEASURE-X", category: "tools", price: 4980, off: 0, rating: 4.2, reviews: 64, stock: 33, isNew: true, description: "ボタン一つで最大40mを瞬時に測定。面積・体積計算にも対応。内装・引越しに便利。", specs: ["測定範囲: 0.05〜40m", "精度: ±2mm", "面積/体積計算", "IP54防塵防滴"] },
  { name: "両刃のこぎり 265mm 替刃式", brand: "KIRIMASU", category: "tools", price: 980, off: 0, rating: 4.1, reviews: 152, stock: 0, description: "縦引き・横引き両対応。切れ味の落ちにくいインパルス硬化刃。替刃交換式で経済的。", specs: ["刃渡り: 265mm", "替刃式", "両刃タイプ"] },

  // --- hardware ---
  { name: "ステンレス ネジ・ビス 徳用アソート 500本", brand: "KANAMONO", category: "hardware", price: 1580, off: 0, rating: 4.4, reviews: 176, stock: 74, rank: 8, description: "よく使うサイズのステンレスビスを詰め合わせ。錆びに強く屋外でも安心。仕切りケース入り。", specs: ["ステンレス製", "約500本入", "サイズ別仕切りケース", "皿頭タイプ"] },
  { name: "L字金具 補強ステー 4個セット 亜鉛メッキ", brand: "KANAMONO", category: "hardware", price: 498, off: 0, rating: 4.3, reviews: 98, stock: 200, description: "棚や家具の角を補強するL字ステー。ビス穴付きですぐ取付け可能。", specs: ["亜鉛メッキ鋼", "4個入", "40×40mm", "ビス同梱"] },
  { name: "SPF材 ツーバイフォー 2×4 1820mm", brand: "WOODLAND", category: "hardware", price: 698, off: 0, rating: 4.0, reviews: 54, stock: 300, description: "DIYの定番SPF材。棚・ラック・ウォールに。乾燥済みで扱いやすい。", specs: ["寸法: 38×89×1820mm", "樹種: SPF", "面取り加工済"] },
  { name: "有孔ボード ペグボード 600×900 フック付", brand: "WALLKIT", category: "hardware", price: 2980, off: 10, rating: 4.6, reviews: 143, stock: 40, rank: 4, description: "壁面収納の決定版。フック15点付きで工具や小物を見せる収納に。塗装済みでそのまま設置可。", specs: ["サイズ: 600×900mm", "穴ピッチ: 25mm", "フック15点付", "MDF素材"] },
  { name: "キャスター 自在+固定 4個セット 耐荷重200kg", brand: "MOVEIT", category: "hardware", price: 1880, off: 0, rating: 4.2, reviews: 61, stock: 55, description: "自在2個・固定2個のセット。ストッパー付きで安心。台車やワゴンのDIYに。", specs: ["径: 50mm", "耐荷重: 計200kg", "自在2/固定2", "ネジ止め式"] },

  // --- paint ---
  { name: "水性 多用途ペンキ 1.6L マットカラー全12色", brand: "COLOR WORKS", category: "paint", price: 2480, off: 0, rating: 4.5, reviews: 231, stock: 48, rank: 5, description: "室内外の木部・鉄部・コンクリートに使える水性塗料。低臭マット仕上げ。約10m²塗装可能。", specs: ["容量: 1.6L", "水性・低臭", "塗り面積: 約8〜10m²", "つや消し"] },
  { name: "刷毛・ローラーセット 塗装トレイ付 7点", brand: "COLOR WORKS", category: "paint", price: 980, off: 0, rating: 4.2, reviews: 89, stock: 90, description: "初めての塗装に必要な道具が一式。ローラー・刷毛・トレイ・マスカー付き。", specs: ["7点セット", "ローラー幅: 15cm", "トレイ付", "水性/油性兼用"] },
  { name: "強力接着剤 多用途 クリア 50g", brand: "BONDTECH", category: "paint", price: 580, off: 0, rating: 4.4, reviews: 312, stock: 150, description: "木・金属・プラ・ゴムなど幅広く接着。透明で目立たず耐水性も◎。", specs: ["容量: 50g", "透明タイプ", "耐水・耐熱", "多用途"] },
  { name: "壁紙 補修シート のり付き 92cm×2.5m", brand: "REFORM", category: "paint", price: 1280, off: 15, rating: 4.1, reviews: 76, stock: 62, isNew: true, description: "賃貸でも貼ってはがせるのり付き壁紙。キズ・汚れ隠しに。カッターで簡単カット。", specs: ["サイズ: 92cm×2.5m", "のり付き", "はがせるタイプ", "防カビ加工"] },

  // --- garden ---
  { name: "培養土 花・野菜用 25L 大容量", brand: "GREEN LIFE", category: "garden", price: 698, off: 0, rating: 4.5, reviews: 402, stock: 110, rank: 3, description: "元肥入りでそのまま使える培養土。花・野菜・観葉植物に。水はけと保水のバランス設計。", specs: ["容量: 25L", "元肥入り", "花・野菜用", "pH調整済"] },
  { name: "プランター 深型 65cm 受け皿付 3個組", brand: "GREEN LIFE", category: "garden", price: 1980, off: 0, rating: 4.3, reviews: 118, stock: 70, description: "野菜づくりに嬉しい深型。底に貯水スペースで水やり回数を減らせる。", specs: ["幅: 65cm", "3個組", "受け皿付", "貯水機能"] },
  { name: "園芸用手袋 ロング 3双 とげ防止", brand: "GARDEN PRO", category: "garden", price: 780, off: 0, rating: 4.4, reviews: 145, stock: 130, description: "バラの剪定や草むしりに。手首までしっかりガード。滑り止め加工。", specs: ["3双入", "ロング丈", "背抜きタイプ", "手のひらゴム加工"] },
  { name: "折りたたみ式 スチール物置 屋外収納 大型", brand: "STORAGE PLUS", category: "garden", price: 24800, off: 25, rating: 4.6, reviews: 58, stock: 2, rank: 10, description: "工具・タイヤ・園芸用品をまとめて収納。錆びに強いガルバリウム鋼板。施錠可能で防犯も安心。", specs: ["外寸: 幅92×奥行53×高161cm", "ガルバリウム鋼板", "施錠対応", "組立式"] },
  { name: "液体肥料 観葉・野菜用 800ml 希釈タイプ", brand: "GREEN LIFE", category: "garden", price: 598, off: 0, rating: 4.2, reviews: 97, stock: 0, description: "水で薄めて与えるだけ。生育に必要な栄養をバランスよく配合。", specs: ["容量: 800ml", "希釈タイプ", "N-P-K配合", "観葉/野菜/花"] },

  // --- car ---
  { name: "洗車セット バケツ・シャンプー・クロス 6点", brand: "AUTO CARE", category: "car", price: 2280, off: 0, rating: 4.3, reviews: 133, stock: 44, description: "これ一つで洗車から拭き上げまで。マイクロファイバークロス・グローブ付き。", specs: ["6点セット", "バケツ12L", "シャンプー500ml", "MFクロス2枚"] },
  { name: "エンジンオイル 4L 化学合成 5W-30", brand: "SPEEDLINE", category: "car", price: 3480, off: 10, rating: 4.5, reviews: 88, stock: 36, rank: 9, description: "省燃費・エンジン保護性能に優れた化学合成油。幅広い国産車に対応。", specs: ["容量: 4L", "5W-30", "化学合成油", "SP/GF-6規格"] },
  { name: "自転車 空気入れ 英・米・仏対応 ゲージ付", brand: "CYCLE MATE", category: "car", price: 1680, off: 0, rating: 4.4, reviews: 261, stock: 75, description: "3種のバルブに対応。圧力ゲージ付きで適正空気圧が一目で分かる。安定の据置型。", specs: ["対応バルブ: 英/米/仏", "ゲージ付", "最大160psi", "据置型"] },
  { name: "LEDワークライト 充電式 マグネット付", brand: "SPEEDLINE", category: "car", price: 2480, off: 0, rating: 4.6, reviews: 174, stock: 52, isNew: true, description: "車の整備やアウトドアに。マグネット・フックで両手が空く。COB高輝度。", specs: ["充電式", "COB LED", "マグネット/フック", "IP54"] },

  // --- cleaning ---
  { name: "多目的洗剤 泡スプレー 400ml×3本", brand: "CLEAN UP", category: "cleaning", price: 880, off: 0, rating: 4.4, reviews: 356, stock: 160, rank: 7, description: "キッチン・浴室・床までこれ一本。密着泡で油汚れを浮かせて落とす。3本まとめ買いでお得。", specs: ["400ml × 3", "泡スプレー", "多目的", "無リン"] },
  { name: "回転モップ バケツセット 水切り脱水", brand: "CLEAN UP", category: "cleaning", price: 3280, off: 15, rating: 4.3, reviews: 142, stock: 40, description: "足踏み脱水で手を汚さない。360度回転で隅までスイスイ。替えモップ2個付き。", specs: ["脱水バケツ付", "替えモップ2個", "360度回転", "マイクロファイバー"] },
  { name: "アルコール除菌スプレー 詰替 5L 業務用", brand: "SANITY", category: "cleaning", price: 2180, off: 0, rating: 4.5, reviews: 209, stock: 55, description: "手指・調理器具・テーブルに。たっぷり使える大容量詰替。食品にも使える成分。", specs: ["容量: 5L", "アルコール65vol%", "詰替用", "食品添加物規格"] },
  { name: "ゴミ袋 45L 半透明 100枚 高密度", brand: "DAILY BASIC", category: "cleaning", price: 698, off: 0, rating: 4.2, reviews: 178, stock: 220, description: "破れにくい高密度ポリ袋。カサカサ薄手で分別ゴミにたっぷり使える。", specs: ["容量: 45L", "100枚入", "半透明", "高密度HDPE"] },

  // --- kitchen ---
  { name: "ステンレス 包丁 三徳 180mm 日本製", brand: "KATANA", category: "kitchen", price: 2980, off: 0, rating: 4.7, reviews: 288, stock: 47, rank: 2, description: "刃付けの良い日本製三徳包丁。肉・魚・野菜オールマイティ。食洗機対応の一体成型。", specs: ["刃渡り: 180mm", "ステンレス刃", "日本製", "食洗機対応"] },
  { name: "保存容器 ガラス 密閉 5個セット 電子レンジ可", brand: "FRESH KEEP", category: "kitchen", price: 1980, off: 10, rating: 4.5, reviews: 164, stock: 68, description: "におい移りしにくい耐熱ガラス。フタは4点ロックで密閉。冷蔵・冷凍・レンジ対応。", specs: ["5個セット", "耐熱ガラス", "4点ロック", "レンジ/冷凍可"] },
  { name: "フライパン 26cm ダイヤモンドコート IH対応", brand: "COOK MASTER", category: "kitchen", price: 2480, off: 0, rating: 4.4, reviews: 197, stock: 58, isNew: true, description: "こびりつきにくいダイヤモンドコート。ガス・IH両対応。軽量で扱いやすい。", specs: ["径: 26cm", "ダイヤモンドコート", "IH/ガス対応", "重量: 620g"] },
  { name: "水切りラック 2段 ステンレス スリム", brand: "KITCHEN PRO", category: "kitchen", price: 3480, off: 20, rating: 4.3, reviews: 76, stock: 30, description: "シンク横に置けるスリム設計。錆びにくいステンレス。箸立て・まな板立て付き。", specs: ["2段式", "ステンレス", "箸立て付", "幅22cm"] },

  // --- storage ---
  { name: "収納ケース 引き出し 4段 幅39cm 押入れ用", brand: "STORAGE PLUS", category: "storage", price: 3980, off: 0, rating: 4.4, reviews: 231, stock: 42, rank: 11, description: "衣類や小物をたっぷり収納。中身が見える半透明。積み重ね対応でクローゼットを有効活用。", specs: ["4段", "幅39×奥行53×高80cm", "半透明", "キャスター取付可"] },
  { name: "メタルラック スチール棚 5段 幅90cm", brand: "RACK LINE", category: "storage", price: 6980, off: 15, rating: 4.5, reviews: 189, stock: 22, description: "耐荷重にすぐれたスチールラック。棚板の高さ調整自在。ガレージ・キッチン・書庫に。", specs: ["5段", "幅90×奥行45×高180cm", "棚1枚耐荷重75kg", "ポール径19mm"] },
  { name: "折りたたみチェア アウトドア 軽量 コンパクト", brand: "OUTFIELD", category: "storage", price: 2280, off: 0, rating: 4.3, reviews: 154, stock: 80, description: "キャンプ・釣り・イベントに。収納袋付きで持ち運びラク。耐荷重100kg。", specs: ["耐荷重: 100kg", "収納袋付", "重量: 1.9kg", "アルミフレーム"] },
  { name: "LEDシーリングライト 8畳 調光調色 リモコン付", brand: "LUMINA", category: "storage", price: 4980, off: 10, rating: 4.6, reviews: 273, stock: 35, rank: 12, description: "リモコンで明るさ・色味を自由に。省エネLEDで電気代を節約。取付簡単。", specs: ["適用: 〜8畳", "調光10段/調色", "リモコン付", "定格3800lm"] },

  // --- pet ---
  { name: "ペットシーツ レギュラー 200枚 薄型", brand: "PET LIFE", category: "pet", price: 1680, off: 0, rating: 4.4, reviews: 421, stock: 95, rank: 13, description: "たっぷり200枚の大容量。吸収力とスピード吸収でモレ安心。消臭ポリマー配合。", specs: ["レギュラー", "200枚入", "薄型", "消臭ポリマー"] },
  { name: "猫システムトイレ 本体 フルカバー 脱臭", brand: "PET LIFE", category: "pet", price: 3480, off: 15, rating: 4.5, reviews: 138, stock: 40, description: "おしっこはシートに、うんちはスコップで。丸洗いできる引き出し式。飛び散り防止フルカバー。", specs: ["フルカバー", "引き出し式", "脱臭対応", "スコップ付"] },
  { name: "ドッグフード 総合栄養食 5kg 国産チキン", brand: "WAN DELI", category: "pet", price: 2980, off: 0, rating: 4.6, reviews: 256, stock: 60, isNew: true, description: "国産チキン主原料の総合栄養食。全成長段階対応。着色料・香料無添加。", specs: ["内容量: 5kg", "総合栄養食", "国産", "無添加"] },

  // --- safety ---
  { name: "作業用手袋 背抜き 10双組 すべり止め", brand: "SAFE HAND", category: "safety", price: 880, off: 0, rating: 4.3, reviews: 312, stock: 200, rank: 14, description: "通気性のよい背抜きタイプ。手のひらのゴムでしっかりグリップ。DIY・引越し・園芸に。", specs: ["10双組", "背抜き", "すべり止め", "Lサイズ"] },
  { name: "防塵マスク 使い捨て 50枚 DS2規格", brand: "SAFE HAND", category: "safety", price: 1480, off: 0, rating: 4.4, reviews: 143, stock: 88, description: "研磨・木工・掃除の粉じん対策に。息苦しくない立体構造。ノーズフィット付き。", specs: ["50枚入", "DS2相当", "立体構造", "ノーズフィット"] },
  { name: "安全靴 スニーカータイプ 樹脂先芯 軽量", brand: "STEP GUARD", category: "safety", price: 3980, off: 10, rating: 4.5, reviews: 167, stock: 45, description: "スニーカー感覚で履ける安全靴。つま先を樹脂先芯で保護。滑りにくいソール。", specs: ["樹脂先芯", "軽量", "耐滑ソール", "25.0〜28.0cm"] },
  { name: "ヘルメット 作業用 通気孔付 あご紐付", brand: "STEP GUARD", category: "safety", price: 1980, off: 0, rating: 4.2, reviews: 62, stock: 70, description: "高所・建築・防災に。通気孔で蒸れにくい。サイズ調整ダイヤル付き。", specs: ["ABS樹脂", "通気孔付", "あご紐付", "サイズ調整式"] },

  // --- electric ---
  { name: "LED電球 E26 60W相当 昼白色 4個パック", brand: "LUMINA", category: "electric", price: 980, off: 0, rating: 4.5, reviews: 389, stock: 150, rank: 15, description: "白熱電球60W相当の明るさで消費電力は約1/8。長寿命40000時間。すぐ点灯。", specs: ["口金: E26", "60W相当/810lm", "昼白色", "4個パック"] },
  { name: "電源タップ 6個口 2m 雷ガード 個別スイッチ", brand: "POWERLINE", category: "electric", price: 1680, off: 0, rating: 4.4, reviews: 214, stock: 90, description: "個別スイッチで待機電力をカット。雷サージから機器を守る。トラッキング防止プラグ。", specs: ["6個口", "コード2m", "雷ガード", "個別スイッチ"] },
  { name: "アルカリ乾電池 単3形 40本 まとめ買い", brand: "POWERCELL", category: "electric", price: 1280, off: 0, rating: 4.6, reviews: 502, stock: 180, description: "長持ちハイパワー。液漏れ防止設計で機器も安心。使用推奨期限10年。", specs: ["単3形", "40本入", "アルカリ", "使用期限10年"] },
  { name: "DCモーター 扇風機 リモコン付 静音 リビング", brand: "AIRFLOW", category: "electric", price: 5980, off: 20, rating: 4.5, reviews: 176, stock: 28, isNew: true, description: "微風から強風まで細かく調整。静音DCモーターで寝室にも。切タイマー・リモコン付き。", specs: ["DCモーター", "風量8段階", "リモコン付", "切タイマー"] },

  // --- daily ---
  { name: "トイレットペーパー ダブル 12ロール×4 まとめ買い", brand: "DAILY BASIC", category: "daily", price: 1780, off: 0, rating: 4.4, reviews: 288, stock: 120, description: "48ロールのまとめ買いでお得。ふんわりダブル。ストックに安心の大容量。", specs: ["ダブル", "12ロール×4", "無香料", "国産パルプ"] },
  { name: "防災リュック 30点セット 2人用 3日分", brand: "SONAE", category: "daily", price: 8980, off: 15, rating: 4.6, reviews: 134, stock: 25, rank: 16, description: "災害時に必要なものを厳選30点。給水袋・簡易トイレ・ライト・保存食まで。玄関に備えて安心。", specs: ["30点セット", "2人用", "3日分想定", "撥水リュック"] },
  { name: "ポリタンク 20L 給水 防災 コック付", brand: "SONAE", category: "daily", price: 1280, off: 0, rating: 4.3, reviews: 98, stock: 70, description: "断水・アウトドアの給水に。コック付きで注ぎやすい。折りたためばコンパクト。", specs: ["容量: 20L", "コック付", "食品衛生法適合", "取っ手付"] },
  { name: "アウトドア LEDランタン 充電式 USB出力 防水", brand: "OUTFIELD", category: "daily", price: 2480, off: 0, rating: 4.5, reviews: 203, stock: 55, isNew: true, description: "キャンプにも防災にも。モバイルバッテリー機能付きでスマホも充電。IPX4防水。", specs: ["充電式", "最大400lm", "USB出力", "IPX4防水"] },

  // --- tools（追加） ---
  { name: "電動サンダー オービタル 集塵機能付", brand: "HAYAKEN PRO", category: "tools", price: 4280, off: 10, rating: 4.3, reviews: 71, stock: 26, description: "木材の研磨・塗装前の下地処理に。集塵ボックスで粉じんを抑制。サンドペーパー3枚付属。", specs: ["オービタル式", "集塵ボックス", "パッド: 112×102mm", "サンドペーパー3枚付"] },
  { name: "コンベックス メジャー 5.5m 25mm幅 マグネット付", brand: "MEASURE-X", category: "tools", price: 1180, off: 0, rating: 4.5, reviews: 188, stock: 140, description: "先端マグネットで一人計測もラク。25mm幅テープでコシがあり長尺も測りやすい。", specs: ["測定: 5.5m", "テープ幅: 25mm", "マグネット爪", "ベルトクリップ"] },
  { name: "工具箱 スチール 3段 折りたたみ式 中皿付", brand: "WORKMATE", category: "tools", price: 3980, off: 0, rating: 4.4, reviews: 96, stock: 34, isNew: true, description: "開くと中皿が展開する山型ツールボックス。工具から小物まで整理して収納。頑丈なスチール製。", specs: ["3段展開", "スチール製", "外寸: 幅40cm", "施錠対応"] },

  // --- hardware（追加） ---
  { name: "南京錠 ステンレス 40mm 同一キー 2個セット", brand: "KANAMONO", category: "hardware", price: 980, off: 0, rating: 4.3, reviews: 112, stock: 90, description: "錆びに強いステンレス製。2個が同じ鍵で開く同一キー仕様。物置・ロッカーに。", specs: ["ステンレス", "40mm", "同一キー", "鍵4本付"] },
  { name: "結束バンド 200mm 白 500本 耐候", brand: "KANAMONO", category: "hardware", price: 780, off: 0, rating: 4.5, reviews: 234, stock: 160, description: "配線まとめや園芸の誘引に。屋外でも劣化しにくい耐候グレード。たっぷり500本。", specs: ["長さ: 200mm", "500本入", "耐候ナイロン", "耐荷重8kg"] },
  { name: "蝶番 ステンレス 64mm 4枚組 ビス付", brand: "KANAMONO", category: "hardware", price: 680, off: 0, rating: 4.2, reviews: 58, stock: 120, description: "扉やDIY収納の開閉に。錆びにくいステンレス。取付ビス同梱ですぐ使える。", specs: ["ステンレス", "64mm", "4枚組", "ビス付"] },

  // --- paint（追加） ---
  { name: "水性 木部保護塗料 3.2L ウォルナット 屋外用", brand: "COLOR WORKS", category: "paint", price: 3480, off: 10, rating: 4.4, reviews: 92, stock: 30, description: "ウッドデッキ・フェンスの防腐・防虫・防カビに。木目を活かす半透明仕上げ。約16m²塗装可能。", specs: ["容量: 3.2L", "水性・屋外用", "防腐防虫防カビ", "半透明"] },
  { name: "マスキングテープ 24mm×18m 5巻 塗装用", brand: "COLOR WORKS", category: "paint", price: 580, off: 0, rating: 4.5, reviews: 176, stock: 130, description: "塗装のはみ出し防止に。手で切れてまっすぐ剥がせる。のり残りしにくい。", specs: ["幅: 24mm", "18m × 5巻", "手切れ可", "14日耐候"] },
  { name: "エポキシパテ 金属・木・コンクリート補修 100g", brand: "BONDTECH", category: "paint", price: 720, off: 0, rating: 4.3, reviews: 84, stock: 95, isNew: true, description: "練って盛って固める万能補修パテ。硬化後は削る・塗るも可能。水回りにも。", specs: ["容量: 100g", "2剤型", "硬化後研磨可", "耐水"] },
  { name: "コーキング材 変成シリコン 330ml ホワイト ガン付", brand: "REFORM", category: "paint", price: 980, off: 0, rating: 4.4, reviews: 121, stock: 70, description: "洗面・浴室・窓枠のすき間充填に。塗装可能な変成シリコン。専用ガン付きですぐ作業。", specs: ["330ml", "変成シリコン", "塗装可", "コーキングガン付"] },

  // --- garden（追加） ---
  { name: "ホース リール 20m 巻取り式 ノズル付", brand: "GARDEN PRO", category: "garden", price: 3980, off: 15, rating: 4.4, reviews: 143, stock: 32, description: "散水パターン7種の切替ノズル付き。ねじれにくいホース。コンパクトに自立収納。", specs: ["長さ: 20m", "自立式リール", "7パターンノズル", "蛇口コネクター付"] },
  { name: "剪定ばさみ アンビル式 ラチェット機構 太枝対応", brand: "GARDEN PRO", category: "garden", price: 1680, off: 0, rating: 4.5, reviews: 167, stock: 60, isNew: true, description: "ラチェットで軽い力で太枝もカット。女性・シニアにもおすすめ。切れ味長持ち。", specs: ["アンビル式", "ラチェット機構", "最大径25mm", "安全ロック付"] },
  { name: "人工芝 ロール 1m×5m 芝丈30mm 水はけ穴付", brand: "GREEN LIFE", category: "garden", price: 4980, off: 20, rating: 4.3, reviews: 108, stock: 24, description: "リアルな4色ミックスの芝葉。ベランダ・庭・ドッグランに。裏面に水抜き穴。", specs: ["1m × 5m", "芝丈30mm", "4色ミックス", "水抜き穴付"] },

  // --- car（追加） ---
  { name: "撥水コーティング剤 スプレー 300ml 全塗装色対応", brand: "AUTO CARE", category: "car", price: 1480, off: 0, rating: 4.4, reviews: 156, stock: 66, description: "洗車後に吹いて拭くだけの簡単施工。強力撥水と艶を両立。全ボディカラーOK。", specs: ["300ml", "全色対応", "簡単施工", "撥水・艶出し"] },
  { name: "タイヤ空気圧計 デジタル LED付 4段階", brand: "SPEEDLINE", category: "car", price: 1280, off: 0, rating: 4.3, reviews: 94, stock: 80, description: "適正空気圧の管理に。LEDライト付きで夜間も見やすい。単位切替対応。", specs: ["デジタル表示", "LEDライト", "4単位切替", "最大150psi"] },
  { name: "自転車 ワイヤーロック 鍵式 12mm×1.8m", brand: "CYCLE MATE", category: "car", price: 980, off: 0, rating: 4.2, reviews: 132, stock: 110, isNew: true, description: "太めの12mmワイヤーで安心。長さ1.8mで車体とポールをまとめて施錠。鍵3本付き。", specs: ["12mm × 1.8m", "鍵式", "スペアキー3本", "被覆付"] },

  // --- cleaning（追加） ---
  { name: "高圧洗浄機 家庭用 コンパクト 静音 洗車・外壁", brand: "CLEAN UP", category: "cleaning", price: 12800, off: 20, rating: 4.5, reviews: 187, stock: 18, rank: 17, description: "頑固な汚れを水圧でパワフルに。洗車・玄関・網戸・外壁に。ノズル2種＋洗剤タンク付き。", specs: ["吐出圧: 8MPa", "静音設計", "ノズル2種", "自吸機能付"] },
  { name: "メラミンスポンジ 60個 カット済 激落ち", brand: "CLEAN UP", category: "cleaning", price: 580, off: 0, rating: 4.4, reviews: 268, stock: 200, description: "水だけで茶渋・水垢を落とす。使いやすいミニサイズ60個。洗剤いらずでエコ。", specs: ["60個入", "カット済", "水だけで洗浄", "メラミン樹脂"] },
  { name: "衣類用洗剤 詰替 特大 3.6kg 抗菌・部屋干し", brand: "SANITY", category: "cleaning", price: 1180, off: 0, rating: 4.3, reviews: 145, stock: 75, description: "部屋干しでも生乾き臭を抑える抗菌処方。たっぷり使える特大詰替。すすぎ1回OK。", specs: ["3.6kg", "詰替", "抗菌・消臭", "すすぎ1回"] },

  // --- kitchen（追加） ---
  { name: "包丁研ぎ器 シャープナー 3段階 引くだけ", brand: "KATANA", category: "kitchen", price: 980, off: 0, rating: 4.3, reviews: 176, stock: 90, description: "荒研ぎ・中研ぎ・仕上げの3段階。数回引くだけで切れ味が復活。滑り止め付きで安全。", specs: ["3段階研磨", "滑り止め", "ステンレス刃対応", "水洗い可"] },
  { name: "土鍋 IH対応 8号 3〜4人用 二重蓋", brand: "COOK MASTER", category: "kitchen", price: 3980, off: 10, rating: 4.5, reviews: 88, stock: 28, isNew: true, description: "IH・直火両対応の万能土鍋。吹きこぼれにくい二重蓋。鍋・雑炊・炊飯に。", specs: ["8号(約2.5L)", "IH/直火対応", "二重蓋", "3〜4人用"] },
  { name: "ステンレス 保温弁当箱 800ml スープジャー付", brand: "FRESH KEEP", category: "kitchen", price: 2680, off: 0, rating: 4.4, reviews: 112, stock: 48, description: "ごはん・おかず・スープを温かいまま。真空断熱で保温保冷。専用バッグ付き。", specs: ["容量: 800ml", "真空断熱", "スープジャー付", "専用バッグ付"] },

  // --- storage（追加） ---
  { name: "突っ張り棚 押入れ ラック 幅70〜110cm 可変", brand: "RACK LINE", category: "storage", price: 2480, off: 0, rating: 4.2, reviews: 97, stock: 55, description: "デッドスペースを収納に。工具不要で突っ張るだけ。幅を伸縮して設置可能。", specs: ["幅70〜110cm可変", "工具不要", "耐荷重20kg", "スチール製"] },
  { name: "布団収納袋 圧縮 特大 2枚組 バルブ式", brand: "STORAGE PLUS", category: "storage", price: 1580, off: 0, rating: 4.3, reviews: 134, stock: 70, description: "掃除機のバルブ式で簡単圧縮。かさばる布団を1/3に。防ダニ・防カビ生地。", specs: ["特大 2枚組", "バルブ式", "防ダニ防カビ", "100×120cm"] },
  { name: "デスクライト LED クランプ式 調光調色 USB給電", brand: "LUMINA", category: "storage", price: 3480, off: 15, rating: 4.5, reviews: 156, stock: 42, isNew: true, description: "目にやさしいフリッカーレス。明るさ・色味を無段階調整。省スペースのクランプ式。", specs: ["クランプ式", "調光調色", "USB給電", "フリッカーレス"] },

  // --- pet（追加） ---
  { name: "キャットフード 成猫用 3kg 国産 グレインフリー", brand: "PET LIFE", category: "pet", price: 2480, off: 0, rating: 4.5, reviews: 189, stock: 65, description: "穀物不使用のグレインフリー。国産チキンとフィッシュ。毛玉ケア成分配合。", specs: ["3kg", "グレインフリー", "国産", "毛玉ケア"] },
  { name: "ペットケージ 折りたたみ 中型犬用 トレイ付", brand: "WAN DELI", category: "pet", price: 6980, off: 15, rating: 4.4, reviews: 78, stock: 20, isNew: true, description: "工具不要で折りたためるスチールケージ。引き出しトレイでお掃除ラクラク。", specs: ["中型犬用", "折りたたみ式", "引き出しトレイ", "スチール製"] },
  { name: "猫砂 鉱物系 8L 固まる 消臭 2袋セット", brand: "PET LIFE", category: "pet", price: 1380, off: 0, rating: 4.3, reviews: 224, stock: 88, description: "しっかり固まってお手入れ簡単。強力消臭でニオイを抑える。粉立ち少なめ。", specs: ["鉱物系(ベントナイト)", "8L × 2袋", "強力消臭", "しっかり固まる"] },

  // --- safety（追加） ---
  { name: "保護メガネ 曇り止め 3個組 UVカット", brand: "SAFE HAND", category: "safety", price: 980, off: 0, rating: 4.3, reviews: 98, stock: 120, description: "研磨・草刈り・DIYの目の保護に。曇り止め加工で視界クリア。メガネの上からもOK。", specs: ["3個組", "曇り止め加工", "UVカット", "オーバーグラス対応"] },
  { name: "電動工具用 防音イヤーマフ 折りたたみ NRR26dB", brand: "STEP GUARD", category: "safety", price: 1980, off: 0, rating: 4.5, reviews: 76, stock: 60, isNew: true, description: "チェンソー・草刈機・射撃練習の騒音対策に。しっかり遮音でも長時間快適。", specs: ["NRR26dB", "折りたたみ式", "クッションパッド", "サイズ調整式"] },
  { name: "革手袋 溶接・作業用 牛床革 2双組 耐熱", brand: "SAFE HAND", category: "safety", price: 1280, off: 0, rating: 4.4, reviews: 64, stock: 85, description: "熱や火花に強い牛床革。溶接・薪ストーブ・BBQに。丈夫で手にフィット。", specs: ["牛床革", "2双組", "耐熱", "ロング丈"] },

  // --- electric（追加） ---
  { name: "LEDセンサーライト 屋外 ソーラー 防水 2個セット", brand: "LUMINA", category: "electric", price: 2980, off: 15, rating: 4.4, reviews: 213, stock: 50, rank: 18, description: "配線不要のソーラー式。人感センサーで自動点灯。玄関・駐車場・防犯に。IP65防水。", specs: ["ソーラー充電", "人感センサー", "2個セット", "IP65防水"] },
  { name: "延長コード 5m 3個口 マグネット付 トラッキング防止", brand: "POWERLINE", category: "electric", price: 1080, off: 0, rating: 4.3, reviews: 142, stock: 100, description: "スチール面に貼れるマグネット付き。作業場や台所で便利。トラッキング防止プラグ。", specs: ["5m", "3個口", "マグネット付", "トラッキング防止"] },
  { name: "モバイルバッテリー 20000mAh PD対応 大容量", brand: "POWERCELL", category: "electric", price: 3480, off: 10, rating: 4.5, reviews: 298, stock: 44, isNew: true, description: "スマホ約4回充電の大容量。PD急速充電対応。防災の備えにも。残量表示付き。", specs: ["20000mAh", "PD/QC対応", "2ポート出力", "残量表示"] },

  // --- daily（追加） ---
  { name: "簡易トイレ 防災 50回分 凝固剤・処理袋セット", brand: "SONAE", category: "daily", price: 3480, off: 0, rating: 4.5, reviews: 96, stock: 40, description: "断水・災害・アウトドアに。10年保存できる凝固剤と処理袋50回分。既存便器に取付。", specs: ["50回分", "10年保存", "凝固剤＋処理袋", "防臭袋付"] },
  { name: "ボックスティッシュ 60箱 320枚(160組) まとめ買い", brand: "DAILY BASIC", category: "daily", price: 2680, off: 10, rating: 4.4, reviews: 178, stock: 90, description: "1年分たっぷり60箱。やわらかな肌触り。ケース買いでストックに安心。", specs: ["60箱", "320枚(160組)", "無香料", "国産"] },
  { name: "折りたたみコンテナ 50L 3個組 フタ付 スタッキング", brand: "OUTFIELD", category: "daily", price: 3280, off: 0, rating: 4.3, reviews: 121, stock: 55, isNew: true, description: "使わない時は畳んで省スペース。キャンプ・引越し・防災備蓄に。フタ付きで積み重ね可。", specs: ["50L × 3個", "折りたたみ式", "フタ付", "耐荷重30kg"] },
];

/** カテゴリ別のサブカテゴリ分類ルール（商品名にキーワードが含まれれば該当）。先頭がフォールバック */
const SUB_RULES: Record<string, Array<{ sub: string; kw: string[] }>> = {
  tools: [
    { sub: "電動工具", kw: ["インパクト", "電動", "サンダー", "ビットセット"] },
    { sub: "測定・レーザー", kw: ["レーザー", "距離計", "メジャー", "コンベックス"] },
    { sub: "作業台・工具箱", kw: ["ワークベンチ", "工具箱"] },
    { sub: "手道具", kw: ["のこぎり", "ドライバービット"] },
  ],
  hardware: [
    { sub: "ネジ・金具", kw: ["ネジ", "ビス", "L字", "金具", "ステー", "蝶番", "南京錠", "結束バンド", "キャスター"] },
    { sub: "木材・建材", kw: ["SPF", "ツーバイフォー", "有孔ボード", "ペグボード", "木材"] },
  ],
  paint: [
    { sub: "塗料", kw: ["ペンキ", "塗料"] },
    { sub: "塗装道具", kw: ["刷毛", "ローラー", "マスキング"] },
    { sub: "接着・補修", kw: ["接着", "壁紙", "パテ", "コーキング", "補修"] },
  ],
  garden: [
    { sub: "土・肥料", kw: ["培養土", "肥料", "土"] },
    { sub: "園芸用品", kw: ["プランター", "手袋", "ホース", "剪定", "人工芝", "じょうろ"] },
    { sub: "エクステリア・物置", kw: ["物置", "フェンス"] },
  ],
  car: [
    { sub: "洗車・メンテ", kw: ["洗車", "撥水", "ワークライト", "空気圧"] },
    { sub: "オイル・ケミカル", kw: ["オイル"] },
    { sub: "自転車用品", kw: ["自転車", "空気入れ", "ワイヤーロック"] },
  ],
  cleaning: [
    { sub: "洗剤・除菌", kw: ["洗剤", "除菌", "アルコール"] },
    { sub: "掃除道具", kw: ["モップ", "スポンジ", "高圧洗浄"] },
    { sub: "消耗品", kw: ["ゴミ袋"] },
  ],
  kitchen: [
    { sub: "調理器具", kw: ["包丁", "フライパン", "土鍋", "研ぎ器", "シャープナー"] },
    { sub: "保存・容器", kw: ["保存容器", "弁当"] },
    { sub: "キッチン雑貨", kw: ["水切り", "ラック"] },
  ],
  storage: [
    { sub: "収納用品", kw: ["収納ケース", "布団", "突っ張り", "収納"] },
    { sub: "家具・ラック", kw: ["メタルラック", "チェア", "ラック"] },
    { sub: "照明・インテリア", kw: ["ライト", "シーリング"] },
  ],
  pet: [
    { sub: "フード", kw: ["フード"] },
    { sub: "トイレ用品", kw: ["シーツ", "トイレ", "猫砂"] },
    { sub: "ケージ・その他", kw: ["ケージ"] },
  ],
  safety: [
    { sub: "手袋", kw: ["手袋"] },
    { sub: "保護具", kw: ["マスク", "メガネ", "ヘルメット", "イヤーマフ"] },
    { sub: "作業着・靴", kw: ["安全靴", "作業服", "作業着"] },
  ],
  electric: [
    { sub: "照明・電球", kw: ["電球", "ライト", "シーリング"] },
    { sub: "電材・配線", kw: ["タップ", "延長コード", "コード"] },
    { sub: "電池・充電", kw: ["乾電池", "電池", "バッテリー"] },
    { sub: "家電", kw: ["扇風機", "家電"] },
  ],
  daily: [
    { sub: "紙・日用品", kw: ["トイレットペーパー", "ティッシュ", "ペーパー"] },
    { sub: "防災", kw: ["防災", "ポリタンク", "簡易トイレ", "給水"] },
    { sub: "アウトドア", kw: ["ランタン", "コンテナ", "アウトドア"] },
  ],
};

function classifySub(name: string, category: string): string {
  const rules = SUB_RULES[category];
  if (!rules || rules.length === 0) return "その他";
  const hit = rules.find((r) => r.kw.some((k) => name.includes(k)));
  return hit ? hit.sub : rules[0].sub;
}

/** カテゴリslug → サブカテゴリ名一覧 */
export const SUBCATEGORIES: Record<string, string[]> = Object.fromEntries(
  Object.entries(SUB_RULES).map(([cat, rules]) => [cat, rules.map((r) => r.sub)]),
);

export const PRODUCTS: Product[] = RAW.map((p, i) => ({
  ...p,
  id: `p${String(i + 1).padStart(3, "0")}`,
  sub: classifySub(p.name, p.category),
}));

/** そのカテゴリで実際に商品が存在するサブカテゴリ（件数付き） */
export function subcategoriesWithCount(slug: string): Array<{ sub: string; count: number }> {
  const products = PRODUCTS.filter((p) => p.category === slug);
  const order = SUBCATEGORIES[slug] ?? [];
  return order
    .map((sub) => ({ sub, count: products.filter((p) => p.sub === sub).length }))
    .filter((s) => s.count > 0);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function rankingProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.rank !== undefined)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    .slice(0, limit);
}

export function saleProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.off > 0)
    .sort((a, b) => b.off - a.off)
    .slice(0, limit);
}

export function newProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.isNew).slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) => {
    const cat = getCategory(p.category);
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (cat ? cat.name.toLowerCase().includes(q) : false)
    );
  });
}
