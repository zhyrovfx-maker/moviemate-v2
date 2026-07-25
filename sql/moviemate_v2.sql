-- ============================================================
-- MovieMate v2 Database Schema
-- Compatible with MySQL / MariaDB (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS moviemate_v2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE moviemate_v2;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Regular Users Table
CREATE TABLE IF NOT EXISTS user (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('user', 'admin') DEFAULT 'user',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Genres Table
CREATE TABLE IF NOT EXISTS genre (
    genre_id    INT AUTO_INCREMENT PRIMARY KEY,
    genre_name  VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Movies Table
CREATE TABLE IF NOT EXISTS movie (
    movie_id         INT AUTO_INCREMENT PRIMARY KEY,
    tmdb_id          INT DEFAULT NULL,
    title            VARCHAR(200) NOT NULL,
    original_title   VARCHAR(200) DEFAULT NULL,
    release_year     YEAR NOT NULL,
    release_date     DATE DEFAULT NULL,
    runtime          INT DEFAULT 120,
    tagline          VARCHAR(255) DEFAULT NULL,
    description      TEXT,
    poster           VARCHAR(255) DEFAULT 'default.jpg',
    backdrop         VARCHAR(255) DEFAULT NULL,
    vote_average     DECIMAL(3,1) DEFAULT 7.5,
    vote_count       INT DEFAULT 100,
    director         VARCHAR(150) DEFAULT 'Unknown',
    cast_members     TEXT DEFAULT NULL,
    youtube_trailer  VARCHAR(100) DEFAULT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Movie ↔ Genre Junction
CREATE TABLE IF NOT EXISTS movie_genre (
    movie_genre_id  INT AUTO_INCREMENT PRIMARY KEY,
    movie_id        INT NOT NULL,
    genre_id        INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre(genre_id) ON DELETE CASCADE,
    UNIQUE KEY uq_movie_genre (movie_id, genre_id)
) ENGINE=InnoDB;

-- Ratings Table (1 to 10 stars)
CREATE TABLE IF NOT EXISTS rating (
    rating_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    movie_id    INT NOT NULL,
    rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_movie_rating (user_id, movie_id)
) ENGINE=InnoDB;

-- Reviews Table
CREATE TABLE IF NOT EXISTS review (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    movie_id    INT NOT NULL,
    comment     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Watchlist Table ('want' | 'watched')
CREATE TABLE IF NOT EXISTS watchlist (
    watchlist_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    movie_id      INT NOT NULL,
    status        ENUM('want', 'watched') DEFAULT 'want',
    added_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_movie_watchlist (user_id, movie_id)
) ENGINE=InnoDB;

-- Seed Default Admin Credentials (password: admin123)
INSERT IGNORE INTO admin (admin_id, name, email, password) VALUES
(1, 'Administrator', 'admin@moviemate.com', '$2y$10$8K1p/a0dR1xqM8k3UJmt2OMGBTwEgkVXqJHxGmFD3jYJXMpE9tKOi');

-- Seed Default Test User Credentials (password: user123)
INSERT IGNORE INTO user (user_id, name, email, password, role) VALUES
(1, 'Alex Mercer', 'user@moviemate.com', '$2y$10$YIXfP8h/6HdVkz1B7UXzCeQp5AEv2CfXMnGlRPhOH1r1x4ElVfQKe', 'user'),
(2, 'Admin User', 'admin@moviemate.com', '$2y$10$8K1p/a0dR1xqM8k3UJmt2OMGBTwEgkVXqJHxGmFD3jYJXMpE9tKOi', 'admin');
