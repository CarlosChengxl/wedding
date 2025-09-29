document.addEventListener('DOMContentLoaded', function() {
    // 照片数据存储
    let photos = [];
    
    // 示例照片数据（当无法从image文件夹读取照片时显示）
    const defaultPhotos = [
        {
            url: 'https://picsum.photos/id/1005/800/600', // 横屏
            alt: '婚礼照片1'
        },
        {
            url: 'https://picsum.photos/id/1006/600/900', // 竖屏
            alt: '婚礼照片2'
        },
        {
            url: 'https://picsum.photos/id/1012/800/500', // 横屏
            alt: '婚礼照片3'
        },
        {
            url: 'https://picsum.photos/id/1014/500/800', // 竖屏
            alt: '婚礼照片4'
        },
        {
            url: 'https://picsum.photos/id/1025/900/600', // 横屏
            alt: '婚礼照片5'
        }
    ];

    // 获取DOM元素
    const slidesContainer = document.querySelector('.carousel-slides');
    const petalsContainer = document.getElementById('petals-container');
    
    let currentIndex = 0;
    let slideInterval;
    let isTransitioning = false;

    // 初始化花瓣效果
    function initPetals() {
        const petalCount = 50; // 花瓣数量
        const colors = ['#f5d8d0', '#ffb6c1', '#ffcccb', '#f8b195'];
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            // 随机位置、大小、颜色和动画延迟
            const size = Math.random() * 8 + 6; // 6-14px
            const left = Math.random() * 100; // 0-100%
            const delay = Math.random() * 10; // 0-10s
            const duration = Math.random() * 10 + 10; // 10-20s
            const rotation = Math.random() * 360; // 0-360deg
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 设置样式
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${left}%`;
            petal.style.animationDelay = `${delay}s`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.transform = `rotate(${rotation}deg)`;
            petal.style.backgroundColor = color;
            
            petalsContainer.appendChild(petal);
        }
    }

    // 尝试从image文件夹读取照片
    function loadImagesFromFolder() {
        // 实际image文件夹中的照片列表
        const imageNames = [
            'TING0002.jpg', 'TING0049.jpg', 'TING0070.jpg', 'TING0115.jpg', 'TING0204.jpg',
            'TING0214.jpg', 'TING0250.jpg', 'TING0258.jpg', 'TING0266.jpg',
            'TING0277.jpg', 'TING0287.jpg', 'TING0291.jpg', 'TING0294.jpg', 'TING0301.jpg',
            'TING0338.jpg', 'TING0341.jpg', 'TING0345.jpg', 'TING0375.jpg', 'TING0391.jpg',
            'TING0396.jpg', 'TING0401.jpg', 'TING0412.jpg', 'TING0434.jpg', 'TING0449.jpg',
            'TING0452.jpg', 'TING0481.jpg', 'TING0524.jpg', 'TING0572.jpg', 'TING0582.jpg',
            'TING0630.jpg', 'TING0641.jpg', 'TING0655.jpg', 'TING0714.jpg', 'TING0747.jpg',
            'TING0792.jpg', 'TING0803.jpg', 'TING0819.jpg', 'TING0839.jpg', 'TING0848.jpg',
            'TING0875.jpg', 'TING0901.jpg', 'TING0914.jpg', 'TING0940.jpg', 'TING0986.jpg',
            'TING1025.jpg', 'TING1039.jpg', 'TING1072.jpg'
        ];
        const imageFolder = 'image/';
        
        let loadedImages = [];
        let loadCount = 0;
        let errorCount = 0;
        
        // 开始加载所有图片
        imageNames.forEach((imageName, index) => {
            const img = new Image();
            const imgUrl = imageFolder + imageName;
            
            img.onload = function() {
                loadedImages.push({
                    url: imgUrl,
                    alt: '婚礼照片' + (index + 1)
                });
                loadCount++;
                
                if (loadCount + errorCount === imageNames.length) {
                    if (loadedImages.length > 0) {
                        photos = loadedImages;
                    } else {
                        // 如果所有图片都加载失败，使用默认图片
                        photos = defaultPhotos;
                    }
                    initCarousel();
                }
            };
            
            img.onerror = function() {
                errorCount++;
                console.warn('无法加载图片:', imgUrl);
                
                if (loadCount + errorCount === imageNames.length) {
                    if (loadedImages.length > 0) {
                        photos = loadedImages;
                    } else {
                        // 如果所有图片都加载失败，使用默认图片
                        photos = defaultPhotos;
                    }
                    initCarousel();
                }
            };
            
            img.src = imgUrl;
        });
        
        // 如果没有图片，使用默认图片
        if (imageNames.length === 0) {
            photos = defaultPhotos;
            initCarousel();
        }
    }

    // 创建轮播项 - 实现无缝循环
    function initCarousel() {
        // 清空现有内容
        slidesContainer.innerHTML = '';

        // 为了实现无缝循环，我们在末尾添加第一张图片的副本
        const displayPhotos = [...photos];
        if (displayPhotos.length > 1) {
            displayPhotos.push({...displayPhotos[0]});
        }

        // 创建轮播项
        displayPhotos.forEach((photo, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = photo.alt;
            
            img.loading = 'lazy';
            
            // 添加加载动画
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.8s ease';
            
            img.onload = function() {
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            };
            
            slide.appendChild(img);
            slidesContainer.appendChild(slide);
        });

        // 初始化自动轮播
        startAutoSlide();
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        
        // 更新轮播位置
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 重置自动轮播
        resetAutoSlide();
        
        // 添加动画效果
        const displayPhotos = slidesContainer.children;
        if (displayPhotos.length > 0) {
            const currentSlide = displayPhotos[currentIndex];
            const currentImg = currentSlide.querySelector('img');
            
            currentImg.style.animation = 'pulse 0.8s ease-in-out';
            setTimeout(() => {
                currentImg.style.animation = 'none';
                isTransitioning = false;
            }, 800);
        }
    }

    // 下一张幻灯片 - 实现无缝循环
    function nextSlide() {
        if (isTransitioning) return;
        
        // 检查是否是最后一张图片（实际是第一张的副本）
        if (currentIndex === photos.length) {
            // 切换到第一张图片（无动画）
            slidesContainer.style.transition = 'none';
            slidesContainer.style.transform = 'translateX(0)';
            
            // 重置当前索引
            currentIndex = 0;
            
            // 强制重绘
            void slidesContainer.offsetWidth;
            
            // 重新启用过渡
            setTimeout(() => {
                slidesContainer.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                isTransitioning = false;
            }, 50);
        } else {
            // 正常切换到下一张
            goToSlide(currentIndex + 1);
        }
    }

    // 开始自动轮播
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // 每5秒切换一次
    }

    // 重置自动轮播
    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // 切换全屏模式
    function toggleFullScreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement) {
            // 进入全屏
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
            }
        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // 添加点击事件来触发全屏模式
    document.addEventListener('click', function(event) {
        // 只有点击轮播区域时才触发全屏
        if (event.target.closest('.wedding-carousel') || event.target.closest('.petals-container')) {
            toggleFullScreen();
        }
    });

    // 添加键盘导航和全屏支持
    document.addEventListener('keydown', (e) => {
        // F11键切换全屏
        if (e.key === 'F11') {
            e.preventDefault(); // 阻止默认行为
            toggleFullScreen();
        } else if (e.key === 'Escape') {
            // ESC键退出全屏（浏览器通常有默认行为，但这里也加上以确保一致性）
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        } else if (e.key === 'ArrowLeft') {
            // 上一张幻灯片
            if (!isTransitioning) {
                if (currentIndex === 0) {
                    // 如果当前是第一张，直接跳到最后一张
                    slidesContainer.style.transition = 'none';
                    slidesContainer.style.transform = `translateX(-${photos.length * 100}%)`;
                    currentIndex = photos.length;
                    
                    // 强制重绘
                    void slidesContainer.offsetWidth;
                    
                    // 重新启用过渡
                    setTimeout(() => {
                        slidesContainer.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        goToSlide(photos.length - 1);
                    }, 50);
                } else {
                    goToSlide(currentIndex - 1);
                }
            }
        } else if (e.key === 'ArrowRight') {
            // 下一张幻灯片
            nextSlide();
        }
    });

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', function() {
        // 可以在这里添加全屏状态变化时的额外处理
        console.log('全屏状态已改变');
    });

    // 窗口大小改变时重新调整布局
    window.addEventListener('resize', () => {
        // 强制重新计算布局
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    });

    // 初始化花瓣效果
    initPetals();
    
    // 从image文件夹加载照片并初始化轮播
    loadImagesFromFolder();

    // 添加淡入动画效果
    setTimeout(() => {
        document.querySelector('.wedding-carousel').style.opacity = '1';
    }, 100);
});