# Fanpit - Space Booking Platform

A comprehensive space booking platform that allows brand owners to create and manage spaces, and users to discover and book them. Built with Next.js frontend and NestJS backend.

## 🚀 Features

### ✅ Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Brand Owner, Attendee)
  - Login persistence across page navigation
  - Secure password handling

- **Space Management**
  - Create, read, update, delete spaces
  - Image upload and gallery
  - Space categorization (Events/Experiences)
  - Location-based search with coordinates
  - Amenities management


### 🎯 Advanced Pricing Engine
- **Flexible Pricing Models**
  - Free spaces option
  - Base price and day rate settings
  - Hourly and daily pricing

- **Dynamic Pricing**
  - Peak/off-peak hour multipliers
  - Configurable peak hours (e.g., 9:00-17:00)
  - Custom peak multipliers

- **Time Block Bundles**
  - Create custom time packages (e.g., "Morning Package 6:00-12:00")
  - Bundle-specific pricing
  - Multiple time block options

- **Promo Codes System**
  - Code creation and management
  - Percentage or fixed amount discounts
  - Usage limits and validity periods
  - Real-time validation

- **Special Events Pricing**
  - Override pricing for specific dates
  - Event-specific pricing
  - Special occasion handling

### 📅 Reservation Workflow
- **Booking Duration Controls**
  - Minimum booking duration (hours)
  - Maximum booking duration (hours)
  - Advance booking limits (days)

- **Cancellation Policies**
  - 24 hours before booking
  - 48 hours before booking
  - 7 days before booking
  - No cancellation option

- **Availability Management**
  - Complex availability calendar
  - Time slot management
  - Real-time availability checking

### 📊 Analytics Dashboard
- **Key Metrics**
  - Total Spaces & Active Spaces
  - Total Bookings & Confirmed Bookings
  - Total Revenue & Average per Booking
  - Booking Rate & Pending Bookings

- **Recent Bookings Table**
  - Latest 5 bookings with status indicators
  - Real-time data updates
  - Booking details and amounts

### 🎨 User Interface
- **Responsive Design**
  - Mobile-first approach
  - Tailwind CSS styling
  - Modern, clean interface

- **Search & Filtering**
  - Search by name, location, amenities
  - Filter by type (Events/Experiences)
  - Capacity-based filtering
  - Real-time search results

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Payment**: Razorpay integration
- **Maps**: Google Maps integration

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Zod
- **File Upload**: Multer
- **Email**: Nodemailer

## 📁 Project Structure

```
Fanpit/
├── fanpit-frontend/          # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── Fanpit-Assesment/        # NestJS Backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── booking/         # Booking module
│   │   ├── space/           # Space module
│   │   ├── user/            # User module
│   │   ├── payment/         # Payment module
│   │   └── email/           # Email service
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Fanpit-Assesment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fanpit
   JWT_SECRET=your-jwt-secret-key
   FRONTEND_URL=http://localhost:3000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the backend server**
   ```bash
   npm run start:dev
   ```
   Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd fanpit-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the frontend root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
   ```

4. **Start the frontend server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

### Database Setup

1. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in backend `.env` file
   - The application will automatically create necessary collections

2. **Initial Data**
   - Register a brand owner account through the frontend
   - Create spaces using the dashboard
   - Test booking functionality

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Spaces
- `GET /api/spaces` - Get all spaces (with pagination)
- `POST /api/spaces` - Create space (Brand Owner only)
- `GET /api/spaces/:id` - Get space by ID
- `PUT /api/spaces/:id` - Update space (Owner only)
- `DELETE /api/spaces/:id` - Delete space (Owner only)
- `GET /api/spaces/my` - Get my spaces (Brand Owner only)

### Bookings
- `GET /api/bookings` - Get all bookings (with pagination)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get my bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Update booking status (Owner only)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## 🎯 Key Features Implementation

### Pricing Engine
The pricing engine supports multiple pricing models:
- **Base Pricing**: Set base price per hour and day rate
- **Dynamic Pricing**: Peak/off-peak multipliers
- **Time Blocks**: Custom time packages with specific pricing
- **Promo Codes**: Discount codes with usage limits
- **Special Events**: Override pricing for specific dates

### Reservation Workflow
Complete booking management:
- **Duration Controls**: Min/max booking duration
- **Advance Booking**: Configurable advance booking limits
- **Cancellation Policies**: Flexible cancellation options
- **Availability Calendar**: Complex availability rules

### Analytics Dashboard
Real-time business metrics:
- **Revenue Tracking**: Total and average revenue
- **Booking Analytics**: Booking rates and status tracking
- **Space Performance**: Space utilization metrics
- **Recent Activity**: Latest bookings and updates

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation with Zod
- CORS configuration
- Secure password hashing
- API rate limiting

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Configure environment variables
4. Set up MongoDB connection
5. Configure reverse proxy (Nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Configure environment variables
4. Set up static file serving

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js and NestJS**
