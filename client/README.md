# Library System - Frontend Client

Frontend aplikasi perpustakaan dengan React dan fitur geolokasi otomatis.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (Port 5000)
npm start

# Build for production
npm run build
```

Frontend akan berjalan di `http://localhost:5000`

## 📁 Project Structure

```
client/src/
├── components/
│   ├── Navbar.js          # Navigation bar with role switcher
│   └── Navbar.css
├── pages/
│   ├── Home.js            # Landing page with stats
│   ├── Books.js           # Browse books page
│   ├── Admin.js           # Admin CRUD panel
│   └── Borrow.js          # Borrow with geolocation
├── services/
│   └── api.js             # Axios API service
├── index.css              # Global styles & theme
└── App.js                 # Main app component
```

## 🎨 Features

### Public Pages
- **Home**: Hero section, statistics, features
- **Books**: Browse all books with search and detail modal

### Admin Panel (Role: Admin)
- ➕ Add new books
- ✏️ Edit existing books
- 🗑️ Delete books
- 📊 View all books in table

### User Panel (Role: User)
- 📚 Borrow books
- 📍 Auto geolocation detection
- ✅ Real-time stock updates

## 🔐 Role Switching

Klik badge **"Admin"** atau **"User"** di navbar untuk switch role:
- **Admin Mode**: Akses Admin Panel
- **User Mode**: Akses Borrow Page

## 📍 Geolocation

Browser akan meminta izin akses lokasi saat borrow:
1. Klik "Allow Location Access"
2. Browser akan popup "Allow/Block"
3. Pilih "Allow"
4. Latitude & longitude akan otomatis terdeteksi

## 🎨 Design System

### Color Palette
- **Primary**: Orange (`#ff8c42`)
- **Background**: Dark (`#1a1a1a`)
- **Card**: Dark gray (`#2a2a2a`)
- **Success**: Green (`#4caf50`)
- **Error**: Red (`#f44336`)

### Features
- ✨ Dark theme dengan orange accent
- 🎭 Smooth animations
- 📱 Fully responsive
- 🔔 Toast notifications
- 🎯 Modern UI/UX

## 🔌 API Integration

Frontend terhubung ke backend di `http://localhost:3000/api`

### Endpoints Used:
- `GET /books` - Fetch all books
- `GET /books/:id` - Get book detail
- `POST /books` - Create book (Admin)
- `PUT /books/:id` - Update book (Admin)
- `DELETE /books/:id` - Delete book (Admin)
- `POST /borrow` - Borrow book (User + Geolocation)

## 📦 Dependencies

- **react**: ^19.2.4
- **axios**: ^1.13.4
- **react-toastify**: ^11.0.5

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Geolocation requires HTTPS or localhost

## 🎯 Usage

### Sebagai User:
1. Switch ke role "User" di navbar
2. Pergi ke "Borrow" page
3. Pilih buku yang ingin dipinjam
4. Klik "Allow Location Access"
5. Submit untuk borrow

### Sebagai Admin:
1. Switch ke role "Admin" di navbar
2. Pergi ke "Admin" page
3. Add/Edit/Delete buku sesuai kebutuhan

## 📸 Screenshots

_(Akan ditambahkan setelah testing)_

## ✅ Checklist

- [x] Setup React app
- [x] Configure port 5000
- [x] Implement dark + orange theme
- [x] Create responsive navbar
- [x] Build Home page with stats
- [x] Build Books page with search
- [x] Build Admin CRUD panel
- [x] Build Borrow page
- [x] Integrate geolocation API
- [x] Connect to backend API
- [x] Add toast notifications
- [ ] Testing & screenshots
