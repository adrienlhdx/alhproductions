/**
 * ALH Productions - JavaScript
 * Animations, navigation, carousel, modal de réservation
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== VARIABLES ====================
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menu-toggle');
    const modal = document.getElementById('modal-reservation');
    const btnReservation = document.getElementById('btn-reservation');
    const ctaReservation = document.getElementById('cta-reservation');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
    const reservationForm = document.getElementById('reservation-form');

    // ==================== HEADER SCROLL ====================
    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        // Ajouter une ombre quand on scroll
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Cacher/Montrer le header selon la direction du scroll
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScroll) {
                // Scroll vers le bas - cacher le header
                header.classList.add('hidden');
            } else {
                // Scroll vers le haut - montrer le header
                header.classList.remove('hidden');
            }
        } else {
            // En haut de page - toujours montrer le header
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ==================== MENU MOBILE ====================
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu au clic sur un lien
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==================== MODAL RÉSERVATION ====================
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Définir la date minimale à aujourd'hui
            const dateInput = document.getElementById('reservation-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btnReservation) {
        btnReservation.addEventListener('click', openModal);
    }

    if (ctaReservation) {
        ctaReservation.addEventListener('click', openModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Vérifier si on revient après un envoi réussi (FormSubmit)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Afficher un message de confirmation
        setTimeout(function() {
            alert('Merci ! Votre demande a bien été envoyée. Je vous recontacterai dans les plus brefs délais.');
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
    }

    // Gestion du formulaire - définir la date minimale à l'ouverture
    if (reservationForm) {
        const dateInput = document.getElementById('reservation-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    // ==================== TÉMOIGNAGES - PAGINATION ====================
    var tGrid = document.getElementById('testimonials-grid');
    var tPrev = document.getElementById('testimonials-prev');
    var tNext = document.getElementById('testimonials-next');
    var tDotsContainer = document.getElementById('testimonials-dots');

    if (tGrid && tPrev && tNext && tDotsContainer) {
        var tCards = tGrid.querySelectorAll('.testimonial-card');
        var CARDS_PER_PAGE = 4;
        var tCurrentPage = 0;
        var tTotalPages = Math.ceil(tCards.length / CARDS_PER_PAGE);
        var tIsAnimating = false;

        // Create dots
        for (var d = 0; d < tTotalPages; d++) {
            var dot = document.createElement('button');
            dot.className = 'testimonials-dot' + (d === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Page ' + (d + 1));
            (function(pageIndex) {
                dot.addEventListener('click', function() { goToTestimonialPage(pageIndex); });
            })(d);
            tDotsContainer.appendChild(dot);
        }
        var tDots = tDotsContainer.querySelectorAll('.testimonials-dot');

        function showTestimonialPage(page, animate) {
            var start = page * CARDS_PER_PAGE;
            var end = start + CARDS_PER_PAGE;

            tCards.forEach(function(card, i) {
                if (i >= start && i < end) {
                    card.classList.add('testimonial-visible');
                    if (animate) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        var delay = (i - start) * 80;
                        setTimeout(function() {
                            card.style.opacity = '';
                            card.style.transform = '';
                        }, delay + 30);
                    }
                } else {
                    card.classList.remove('testimonial-visible');
                }
            });

            // Update dots
            tDots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === page);
            });

            // Update arrows
            tPrev.disabled = (page === 0);
            tNext.disabled = (page === tTotalPages - 1);
        }

        function goToTestimonialPage(page) {
            if (page === tCurrentPage || tIsAnimating || page < 0 || page >= tTotalPages) return;
            tIsAnimating = true;

            // Fade out current cards
            var currentStart = tCurrentPage * CARDS_PER_PAGE;
            var currentEnd = currentStart + CARDS_PER_PAGE;
            var visibleCards = [];
            tCards.forEach(function(card, i) {
                if (i >= currentStart && i < currentEnd) {
                    visibleCards.push(card);
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-15px)';
                }
            });

            setTimeout(function() {
                // Hide old, show new
                visibleCards.forEach(function(card) {
                    card.classList.remove('testimonial-visible');
                    card.style.opacity = '';
                    card.style.transform = '';
                });

                tCurrentPage = page;
                showTestimonialPage(tCurrentPage, true);

                setTimeout(function() {
                    tIsAnimating = false;
                }, CARDS_PER_PAGE * 80 + 100);
            }, 350);
        }

        tPrev.addEventListener('click', function() { goToTestimonialPage(tCurrentPage - 1); });
        tNext.addEventListener('click', function() { goToTestimonialPage(tCurrentPage + 1); });

        // Initial display (no animation)
        showTestimonialPage(0, false);

        // Fix grid height to the tallest page to prevent layout jumps
        var maxGridH = 0;
        for (var p = 0; p < tTotalPages; p++) {
            tCards.forEach(function(card, i) {
                var s = p * CARDS_PER_PAGE;
                if (i >= s && i < s + CARDS_PER_PAGE) {
                    card.classList.add('testimonial-visible');
                } else {
                    card.classList.remove('testimonial-visible');
                }
            });
            var h = tGrid.offsetHeight;
            if (h > maxGridH) maxGridH = h;
        }
        showTestimonialPage(0, false);
        tGrid.style.minHeight = maxGridH + 'px';

        // Recalculate on resize
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                tGrid.style.minHeight = '';
                var newMax = 0;
                for (var p = 0; p < tTotalPages; p++) {
                    tCards.forEach(function(card, i) {
                        var s = p * CARDS_PER_PAGE;
                        if (i >= s && i < s + CARDS_PER_PAGE) {
                            card.classList.add('testimonial-visible');
                        } else {
                            card.classList.remove('testimonial-visible');
                        }
                    });
                    var h = tGrid.offsetHeight;
                    if (h > newMax) newMax = h;
                }
                showTestimonialPage(tCurrentPage, false);
                tGrid.style.minHeight = newMax + 'px';
            }, 200);
        });
    }

    // ==================== TÉMOIGNAGES - LIRE LA SUITE (mobile) ====================
    const testimonialToggles = document.querySelectorAll('.testimonial-toggle');

    testimonialToggles.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const text = this.parentElement.querySelector('.testimonial-text');
            const isExpanded = text.classList.contains('expanded');

            text.classList.toggle('expanded');
            this.textContent = isExpanded ? 'Lire la suite' : 'Réduire';
            this.setAttribute('aria-expanded', String(!isExpanded));
        });
    });

    // ==================== TÉMOIGNAGES - HOVER FOCUS (desktop) ====================
    if (tGrid && window.matchMedia('(hover: hover)').matches) {
        var testimonialOverlay = document.createElement('div');
        testimonialOverlay.className = 'testimonial-overlay';
        document.body.appendChild(testimonialOverlay);

        var focusedClone = null;
        var focusedOriginal = null;
        var hoverTimer = null;
        var isAnimatingFocus = false;

        // Event delegation with mouseover/mouseout (they bubble, unlike mouseenter/mouseleave)
        var hoveredCard = null;

        tGrid.addEventListener('mouseover', function(e) {
            var card = e.target.closest('.testimonial-card');
            if (card === hoveredCard) return; // still on same card, ignore child transitions

            // Clear any pending timer from previous card
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }

            hoveredCard = card;
            if (!card || focusedClone || isAnimatingFocus) return;

            hoverTimer = setTimeout(function() {
                if (hoveredCard === card) {
                    openTestimonialFocus(card);
                }
            }, 1000);
        });

        tGrid.addEventListener('mouseout', function(e) {
            var card = e.target.closest('.testimonial-card');
            var toCard = e.relatedTarget ? e.relatedTarget.closest('.testimonial-card') : null;

            // Only cancel if actually leaving the card, not moving between its children
            if (card && card !== toCard) {
                hoveredCard = toCard;
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
            }
        });

        // Click to open immediately
        tGrid.addEventListener('click', function(e) {
            var card = e.target.closest('.testimonial-card');
            if (!card || focusedClone || isAnimatingFocus) return;
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            openTestimonialFocus(card);
        });

        function resetFocusState() {
            if (focusedClone && focusedClone.parentNode) focusedClone.remove();
            if (focusedOriginal) {
                focusedOriginal.style.opacity = '';
                focusedOriginal.style.transition = '';
            }
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            testimonialOverlay.classList.remove('active');
            testimonialOverlay.removeEventListener('click', closeTestimonialFocus);
            document.removeEventListener('keydown', escTestimonialFocus);
            focusedClone = null;
            focusedOriginal = null;
            hoveredCard = null;
            isAnimatingFocus = false;
        }

        function openTestimonialFocus(card) {
            if (focusedClone || isAnimatingFocus) return;
            if (!card.classList.contains('testimonial-visible')) return;
            isAnimatingFocus = true;

            var rect = card.getBoundingClientRect();
            var vpW = window.innerWidth;
            var vpH = window.innerHeight;

            var clone = card.cloneNode(true);
            clone.className = 'testimonial-card-focus';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';

            document.body.appendChild(clone);

            var expandedH = Math.min(clone.scrollHeight, vpH * 0.8);

            clone.style.maxHeight = rect.height + 'px';
            clone.style.overflowY = 'hidden';
            clone.style.transform = 'translate(0, 0)';
            clone.offsetHeight;

            focusedClone = clone;
            focusedOriginal = card;

            card.style.opacity = '0';
            card.style.transition = 'opacity 0.2s ease';

            var scrollbarW = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarW + 'px';
            document.body.style.overflow = 'hidden';

            testimonialOverlay.classList.add('active');

            var dx = (vpW / 2) - (rect.left + rect.width / 2);
            var dy = (vpH / 2) - rect.top - (expandedH / 2);
            if (rect.top + dy < 20) dy = 20 - rect.top;
            if (rect.top + dy + expandedH > vpH - 20) dy = vpH - 20 - rect.top - expandedH;

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    clone.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
                    clone.style.maxHeight = expandedH + 'px';
                    clone.style.overflowY = 'auto';
                });
            });

            // Safety timeout if transitionend never fires
            var arrivalSafety = setTimeout(function() {
                isAnimatingFocus = false;
                clone.addEventListener('mouseleave', closeTestimonialFocus);
            }, 800);

            clone.addEventListener('transitionend', function onArrived(e) {
                if (e.propertyName !== 'transform') return;
                clone.removeEventListener('transitionend', onArrived);
                clearTimeout(arrivalSafety);
                isAnimatingFocus = false;
                clone.addEventListener('mouseleave', closeTestimonialFocus);
            });

            testimonialOverlay.addEventListener('click', closeTestimonialFocus);
            document.addEventListener('keydown', escTestimonialFocus);
        }

        function closeTestimonialFocus() {
            if (!focusedClone || isAnimatingFocus) return;
            isAnimatingFocus = true;

            var clone = focusedClone;
            var card = focusedOriginal;
            var rect = card.getBoundingClientRect();

            clone.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), '
                + 'max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1), '
                + 'opacity 0.5s ease';

            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.transform = 'translate(0, 0)';
            clone.style.maxHeight = rect.height + 'px';
            clone.style.overflowY = 'hidden';
            clone.style.opacity = '0';

            card.style.transition = 'opacity 0.5s ease 0.15s';
            card.style.opacity = '1';

            testimonialOverlay.classList.remove('active');

            // Safety timeout if transitionend never fires
            var closeSafety = setTimeout(function() {
                resetFocusState();
            }, 900);

            clone.addEventListener('transitionend', function onEnd(e) {
                if (e.propertyName !== 'transform') return;
                clone.removeEventListener('transitionend', onEnd);
                clearTimeout(closeSafety);
                resetFocusState();
            });

            clone.removeEventListener('mouseleave', closeTestimonialFocus);
            testimonialOverlay.removeEventListener('click', closeTestimonialFocus);
            document.removeEventListener('keydown', escTestimonialFocus);
        }

        function escTestimonialFocus(e) {
            if (e.key === 'Escape') closeTestimonialFocus();
        }
    }

    // ==================== ANIMATIONS AU SCROLL ====================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==================== COMPTEUR ANIMÉ ====================
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, count);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => {
        counterObserver.observe(num);
    });

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==================== PARALLAX EFFECT (optionnel) ====================
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // ==================== VIDÉO HEADER - PAUSE HORS VIEWPORT + VISIBILITÉ ONGLET ====================
    const headerVideo = document.getElementById('header-video');

    if (headerVideo) {
        // Pause/play selon la visibilité dans le viewport
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !document.hidden) {
                    headerVideo.play().catch(function() {});
                } else {
                    headerVideo.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(headerVideo);

        // Pause quand l'onglet est caché (économie GPU même si visible dans le viewport)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                headerVideo.pause();
            } else {
                // Relancer uniquement si la vidéo est dans le viewport
                var rect = headerVideo.getBoundingClientRect();
                var inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
                if (inViewport) {
                    headerVideo.play().catch(function() {});
                }
            }
        });
    }

    // ==================== LAZY LOADING VIDEOS (préparation) ====================
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');

    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoEmbed = this.parentElement;
            const videoUrl = this.getAttribute('data-video-url');

            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                videoEmbed.innerHTML = '';
                videoEmbed.appendChild(iframe);
            }
        });
    });

    // ==================== PRÉCHARGEMENT DES IMAGES ====================
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadImages();

    // ==================== DISCIPLINE CARDS HOVER (page sport) ====================
    const disciplineCards = document.querySelectorAll('.discipline-card');

    disciplineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--color-gold)';
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--color-gray)';
            this.style.transform = 'translateY(0)';
        });
    });

    // ==================== SVG DÉCORATIFS MARIAGE - POSITIONS ALÉATOIRES SANS CHEVAUCHEMENT + PARALLAX ====================
    const decoSvgs = document.querySelectorAll('.deco-svg');
    if (decoSvgs.length > 0) {
        const parallaxSpeeds = [0.05, 0.03, 0.07, 0.04, 0.06, 0.08, 0.035, 0.055, 0.045, 0.065];
        const maxOpacity = 0.18;

        // Grouper les SVGs par section parente
        const sectionGroups = new Map();
        decoSvgs.forEach(function(svg, index) {
            var section = svg.closest('section');
            if (!sectionGroups.has(section)) sectionGroups.set(section, []);
            sectionGroups.get(section).push({ svg: svg, index: index });
        });

        sectionGroups.forEach(function(group, section) {
            var sW = section.offsetWidth;
            var sH = section.offsetHeight;
            var sectionRect = section.getBoundingClientRect();
            var placed = [];

            // Zone interdite réduite : le conteneur central avec marge rétrécie
            var container = section.querySelector('.container');
            if (container) {
                var cRect = container.getBoundingClientRect();
                var shrink = 300;
                placed.push({
                    x: cRect.left - sectionRect.left + shrink,
                    y: cRect.top - sectionRect.top + 40,
                    w: cRect.width - shrink * 2,
                    h: cRect.height - 80
                });
            }

            group.forEach(function(item, i) {
                item.side = (i % 2 === 0) ? 'left' : 'right';
                var svg = item.svg;
                var index = item.index;
                var size, topPx, leftPx, valid;
                var attempts = 0;
                var maxSize = 650;

                do {
                    size = Math.floor(Math.random() * (maxSize - 200)) + 200;
                    var padX = sW * 0.05;
                    var halfW = sW / 2;
                    topPx = Math.random() * (sH - size * 0.5);
                    if (item.side === 'left') {
                        leftPx = padX + Math.random() * Math.max(halfW - size - padX, 0);
                    } else {
                        leftPx = halfW + Math.random() * Math.max(halfW - size - padX, 0);
                    }

                    valid = placed.every(function(p) {
                        var marginX = 200;
                        var marginY = 350;
                        return (leftPx + size < p.x - marginX || leftPx > p.x + p.w + marginX ||
                                topPx + size < p.y - marginY || topPx > p.y + p.h + marginY);
                    });

                    attempts++;
                    if (attempts % 25 === 0) maxSize = Math.max(maxSize - 80, 200);
                } while (!valid && attempts < 500);

                var rotation = Math.floor(Math.random() * 50) - 25;

                svg.style.top = topPx + 'px';
                svg.style.left = leftPx + 'px';
                svg.style.width = size + 'px';
                svg.style.height = size + 'px';

                placed.push({ x: leftPx, y: topPx, w: size, h: size });

                var baseTransform = 'rotate(' + rotation + 'deg)';
                svg.dataset.baseTransform = baseTransform;
                svg.style.transform = baseTransform;
                svg.dataset.speed = (0.04 + Math.random() * 0.09).toFixed(4);
            });
        });

        function updateDecoSvgs() {
            var scrollY = window.pageYOffset;
            var viewportCenter = window.innerHeight / 2;
            var fadeRange = window.innerHeight * 0.55;

            decoSvgs.forEach(function(svg) {
                var rect = svg.getBoundingClientRect();
                var svgCenter = rect.top + rect.height / 2;
                var distance = Math.abs(svgCenter - viewportCenter);
                var opacity = Math.max(0, maxOpacity * (1 - distance / fadeRange));
                svg.style.opacity = opacity;

                var speed = parseFloat(svg.dataset.speed);
                var yOffset = scrollY * speed;
                svg.style.transform = 'translateY(' + yOffset + 'px) ' + svg.dataset.baseTransform;
            });
        }

        updateDecoSvgs();

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateDecoSvgs();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ==================== COMPTEUR FLOTTANT (page entreprises) ====================
    const floatingCounter = document.getElementById('floating-counter');

    if (floatingCounter) {
        const counterItems = floatingCounter.querySelectorAll('.counter-item');
        const counterValues = floatingCounter.querySelectorAll('.counter-value');
        const countDuration = 10000;
        const pauseAfterCount = 2000;

        // Met à jour les slots individuels (chaque chiffre dans son propre span fixe)
        function updateSlots(v, n) {
            var maxLen = parseInt(v.dataset.maxLen);
            var curStr = Math.floor(n).toLocaleString('fr-FR');
            // Padding gauche avec espaces insécables jusqu'à maxLen
            while (curStr.length < maxLen) curStr = '\u00A0' + curStr;
            var numSlots = v.querySelectorAll('.digit-num');
            for (var i = 0; i < numSlots.length; i++) {
                numSlots[i].textContent = curStr[i];
            }
        }

        function animateCount(counter, onDone) {
            var target = parseInt(counter.getAttribute('data-target'));
            var steps = Math.floor(countDuration / (1000 / 60));
            var step = 0;
            updateSlots(counter, 0);

            function tick() {
                step++;
                var eased = (1 - Math.cos(Math.PI * step / steps)) / 2;
                updateSlots(counter, eased * target);
                if (step < steps) {
                    requestAnimationFrame(tick);
                } else {
                    updateSlots(counter, target);
                    if (onDone) onDone();
                }
            }
            requestAnimationFrame(tick);
        }

        var currentIndex = 0;

        function showCounter(index) {
            var item = counterItems[index];
            var value = counterValues[index];

            item.classList.remove('fade-out');
            item.classList.add('visible');

            setTimeout(function() {
                animateCount(value, function() {
                    setTimeout(function() {
                        // Le suivant commence à apparaître doucement
                        currentIndex = (index + 1) % counterItems.length;
                        showCounter(currentIndex);

                        // L'actuel commence à disparaître un peu après
                        setTimeout(function() {
                            item.classList.add('fade-out');

                            setTimeout(function() {
                                item.classList.remove('visible');
                                item.classList.remove('fade-out');
                                updateSlots(value, 0);
                            }, 1300);
                        }, 400);
                    }, pauseAfterCount);
                });
            }, 400);
        }

        // Crée les slots de chiffres individuels après chargement des polices
        function initCounterSlots() {
            // Facteur de resserrement des chiffres (< 1 = plus serré)
            var digitFactor = 0.88;

            counterValues.forEach(function(v) {
                var target = parseInt(v.getAttribute('data-target'));
                var maxNumStr = target.toLocaleString('fr-FR'); // ex: "50 000"

                // Récupère la font-size en px pour convertir en em (responsif)
                var fontSize = parseFloat(window.getComputedStyle(v).fontSize);

                // Mesure la largeur d'un chiffre, convertie en em
                v.textContent = '0';
                var digitEm = (v.getBoundingClientRect().width * digitFactor / fontSize);

                // Mesure la largeur réelle du séparateur de milliers, convertie en em
                var sepIdx = maxNumStr.search(/\D/);
                var sepEm;
                if (sepIdx >= 0) {
                    v.textContent = maxNumStr[sepIdx];
                    sepEm = v.getBoundingClientRect().width / fontSize;
                    if (sepEm <= 0) sepEm = digitEm * 0.3;
                } else {
                    sepEm = digitEm * 0.3;
                }

                // Mesure la largeur du "+", convertie en em
                v.textContent = '+';
                var plusEm = (v.getBoundingClientRect().width * digitFactor / fontSize);

                // Construire les slots
                v.textContent = '';
                v.style.display = 'inline-flex';
                v.style.alignItems = 'center';
                v.dataset.maxLen = maxNumStr.length;

                // Slot "+" (toujours fixe, jamais modifié)
                var plusSlot = document.createElement('span');
                plusSlot.className = 'digit-slot';
                plusSlot.style.width = plusEm + 'em';
                plusSlot.textContent = '+';
                v.appendChild(plusSlot);

                // Un slot par caractère : largeur adaptée selon chiffre ou séparateur
                for (var i = 0; i < maxNumStr.length; i++) {
                    var slot = document.createElement('span');
                    slot.className = 'digit-slot digit-num';
                    var isDigit = /\d/.test(maxNumStr[i]);
                    slot.style.width = (isDigit ? digitEm : sepEm) + 'em';
                    slot.textContent = '\u00A0';
                    v.appendChild(slot);
                }
            });
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function() {
                initCounterSlots();
                showCounter(0);
            });
        } else {
            setTimeout(function() {
                initCounterSlots();
                showCounter(0);
            }, 500);
        }

        // Scroll-based opacity: hide on videos, show on other sections
        function updateCounterOpacity() {
            var scrollY = window.pageYOffset;
            var viewportH = window.innerHeight;
            var scrollCenter = scrollY + viewportH / 2;

            var ctaSection = document.querySelector('.cta-section');
            var pageHeader = document.querySelector('.page-header');
            var footer = document.querySelector('.footer');

            var hiddenZones = [];

            if (pageHeader) {
                hiddenZones.push({
                    top: pageHeader.offsetTop,
                    bottom: pageHeader.offsetTop + pageHeader.offsetHeight
                });
            }
            if (ctaSection) {
                hiddenZones.push({
                    top: ctaSection.offsetTop,
                    bottom: ctaSection.offsetTop + ctaSection.offsetHeight
                });
            }
            if (footer) {
                hiddenZones.push({
                    top: footer.offsetTop,
                    bottom: footer.offsetTop + footer.offsetHeight
                });
            }

            var fadeMargin = viewportH * 0.35;
            var opacity = 0.08;

            for (var z = 0; z < hiddenZones.length; z++) {
                var zone = hiddenZones[z];

                if (scrollCenter >= zone.top && scrollCenter <= zone.bottom) {
                    opacity = 0;
                    break;
                }
                if (scrollCenter < zone.top && scrollCenter > zone.top - fadeMargin) {
                    opacity = Math.min(opacity, ((zone.top - scrollCenter) / fadeMargin) * 0.08);
                }
                if (scrollCenter > zone.bottom && scrollCenter < zone.bottom + fadeMargin) {
                    opacity = Math.min(opacity, ((scrollCenter - zone.bottom) / fadeMargin) * 0.08);
                }
            }

            floatingCounter.style.opacity = Math.max(0, opacity);
        }

        updateCounterOpacity();

        var counterTicking = false;
        window.addEventListener('scroll', function() {
            if (!counterTicking) {
                requestAnimationFrame(function() {
                    updateCounterOpacity();
                    counterTicking = false;
                });
                counterTicking = true;
            }
        });
    }

    // ==================== CONSOLE MESSAGE ====================
    console.log(`
    %c ALH Productions
    %c Site créé avec passion par Adrien
    `,
    'color: #c9a962; font-size: 20px; font-weight: bold;',
    'color: #888; font-size: 12px;'
    );

    // ==================== GLOW DOT + TRAÎNÉE (CANVAS) ====================
    const glowWrapper = document.getElementById('glow-wrapper');
    const glowDot = document.getElementById('glow-dot');
    const glowCanvas = document.getElementById('glow-canvas');

    if (glowWrapper && glowDot && glowCanvas) {
        const ctx = glowCanvas.getContext('2d');
        const DURATION = 10000;
        const TRAIL_LENGTH = 400;
        const PADDING = 20; // marge autour du bouton pour le glow
        const startTime = performance.now();

        function perimeterToXY(dist, w, h, perimeter) {
            dist = ((dist % perimeter) + perimeter) % perimeter;
            if (dist <= w / 2) {
                return { x: w / 2 + dist, y: 0 };
            } else if (dist <= w / 2 + h) {
                return { x: w, y: dist - w / 2 };
            } else if (dist <= w / 2 + h + w) {
                return { x: w - (dist - w / 2 - h), y: h };
            } else if (dist <= w / 2 + h + w + h) {
                return { x: 0, y: h - (dist - w / 2 - h - w) };
            } else {
                return { x: dist - (w / 2 + h + w + h), y: 0 };
            }
        }

        function animateGlow(timestamp) {
            const w = glowWrapper.offsetWidth;
            const h = glowWrapper.offsetHeight;
            const perimeter = 2 * w + 2 * h;
            const dpr = window.devicePixelRatio || 1;

            // Ajuster le canvas
            const cw = w + PADDING * 2;
            const ch = h + PADDING * 2;
            if (glowCanvas.width !== cw * dpr || glowCanvas.height !== ch * dpr) {
                glowCanvas.width = cw * dpr;
                glowCanvas.height = ch * dpr;
                glowCanvas.style.width = cw + 'px';
                glowCanvas.style.height = ch + 'px';
                ctx.scale(dpr, dpr);
            }

            ctx.clearRect(0, 0, cw, ch);

            const elapsed = (timestamp - startTime) % DURATION;
            const headDist = (elapsed / DURATION) * perimeter;

            // Positionner le point DOM
            const head = perimeterToXY(headDist, w, h, perimeter);
            glowDot.style.left = head.x + 'px';
            glowDot.style.top = head.y + 'px';

            // Dessiner la traînée sur le canvas
            const steps = 150;
            for (let i = 0; i < steps; i++) {
                const t = i / steps;
                const offset = t * TRAIL_LENGTH;
                const pos = perimeterToXY(headDist - offset, w, h, perimeter);
                const x = pos.x + PADDING;
                const y = pos.y + PADDING;

                const alpha = Math.pow(1 - t, 2);
                const radius = 2 + t * 6;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.4) + ')';
                ctx.shadowColor = 'rgba(255, 255, 255, ' + alpha + ')';
                ctx.shadowBlur = 8 + t * 15;
                ctx.fill();
            }

            // Reset shadow pour éviter les artefacts
            ctx.shadowBlur = 0;

            requestAnimationFrame(animateGlow);
        }

        requestAnimationFrame(animateGlow);
    }
});
