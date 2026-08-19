const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Article = require('./modules/article/article.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const categories = ['Nutrition', 'Health & Wellness', 'Parenting Tips', 'Milestones'];

// High-quality Unsplash images related to parenting and babies
const images = [
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1510018572596-a4082103ef85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492551557933-34265f7af79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524503033411-c95669b66bcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// Content generators
const nutritionTopics = [
  "Introducing Solid Foods to Your Baby",
  "Top 10 Superfoods for 6-Month-Old Babies",
  "Allergies and How to Spot Them Early",
  "Healthy Snacking Alternatives for Toddlers",
  "The Role of Iron in Your Baby's Diet",
  "Vegan Diets for Babies: What You Need to Know",
  "Transitioning from Formula to Cow's Milk",
  "How to Make Homemade Baby Purees",
  "Understanding Baby Led Weaning",
  "Picky Eaters: Strategies for Stress-Free Meals"
];

const healthTopics = [
  "Understanding Baby Sleep Cycles",
  "Dealing with Teething Pains",
  "When to Call the Pediatrician",
  "A Guide to Baby Vaccinations",
  "Recognizing Common Rashes",
  "How to Safely Trim Baby Nails",
  "Managing Colic and Gas",
  "The Best Skincare Routine for Newborns",
  "Navigating the First Cold and Fever",
  "Tips for a Safe Sleep Environment"
];

const parentingTopics = [
  "The Importance of Tummy Time",
  "Balancing Work and New Parenthood",
  "How to Build a Bond with Your Newborn",
  "Managing Screen Time for Toddlers",
  "The Benefits of Reading to Your Baby",
  "Traveling with a Newborn: A Survival Guide",
  "Self-Care Tips for New Moms and Dads",
  "Setting Up the Perfect Nursery",
  "How to Establish a Bedtime Routine",
  "Understanding and Navigating Tantrums"
];

const milestoneTopics = [
  "Milestones: When Will My Baby Walk?",
  "First Words: What to Expect and When",
  "The Pincer Grasp and Fine Motor Skills",
  "Understanding Separation Anxiety",
  "When Do Babies Start Smiling?",
  "Rolling Over: A Major Milestone",
  "The Journey to Sitting Independently",
  "Crawling Styles and What They Mean",
  "Cognitive Leaps During the First Year",
  "Potty Training Readiness Signs"
];

const paragraphs = [
  "Parenting is a journey filled with incredible moments and immense challenges. Every child is unique, meaning there is no one-size-fits-all approach. However, equipping yourself with evidence-based knowledge can make navigating these early years significantly easier and more rewarding.",
  "One of the most common concerns for new parents revolves around establishing a consistent routine. While it might seem daunting initially, babies thrive on predictability. Whether it's feeding, sleeping, or playtime, consistency signals to your baby what is coming next, providing them with a profound sense of security.",
  "It is completely normal to feel overwhelmed. Seeking advice from pediatricians, trusted resources, and experienced parents can provide clarity. Remember, trusting your parental instinct is just as important as any advice you receive.",
  "Early childhood development happens at an astonishing pace. During the first year, a baby's brain doubles in size. Engaging with your child through talking, reading, and simple play can have a monumental impact on their cognitive and emotional development.",
  "Health and wellness in the early years set the foundation for a lifetime. From ensuring they receive the right nutrients to protecting their delicate immune systems, every small step you take contributes to their long-term well-being."
];

const sections = [
  { title: "Understanding the Basics", type: "intro" },
  { title: "Key Strategies to Try", type: "tips" },
  { title: "What the Experts Say", type: "expert" },
  { title: "Common Mistakes to Avoid", type: "mistakes" },
  { title: "Building a Better Routine", type: "routine" }
];

const generateContent = () => {
  const numSections = Math.floor(Math.random() * 3) + 2; // 2 to 4 sections
  let content = `<p>${paragraphs[Math.floor(Math.random() * paragraphs.length)]}</p><br/>`;
  
  for (let i = 0; i < numSections; i++) {
    const section = sections[Math.floor(Math.random() * sections.length)];
    content += `<h2>${section.title}</h2>`;
    content += `<p>${paragraphs[Math.floor(Math.random() * paragraphs.length)]}</p>`;
    
    // Sometimes add a list
    if (Math.random() > 0.5) {
      content += `<ul>
        <li>Consistency is always the key factor.</li>
        <li>Be patient and give it time to work.</li>
        <li>Don't hesitate to ask for professional help if needed.</li>
      </ul>`;
    }
  }
  return content;
};

const allTopics = [
  ...nutritionTopics.map(t => ({ title: t, category: 'Nutrition', tags: ['nutrition', 'diet', 'food'] })),
  ...healthTopics.map(t => ({ title: t, category: 'Health & Wellness', tags: ['health', 'wellness', 'care'] })),
  ...parentingTopics.map(t => ({ title: t, category: 'Parenting Tips', tags: ['parenting', 'tips', 'lifestyle'] })),
  ...milestoneTopics.map(t => ({ title: t, category: 'Milestones', tags: ['milestones', 'growth', 'development'] }))
];

const seed100Articles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moncradel';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected. Emptying existing articles...');
    await Article.deleteMany();

    console.log('Generating and inserting 100 articles...');
    const dummyAuthorId = new mongoose.Types.ObjectId();
    const generatedArticles = [];

    for (let i = 0; i < 100; i++) {
      // Pick a base topic (we have 40, so some will repeat with variations)
      const baseTopic = allTopics[i % allTopics.length];
      
      // Add some variation to the title for uniqueness after the first 40
      const title = i >= allTopics.length 
        ? `${baseTopic.title}: Part ${Math.floor(i / allTopics.length) + 1}` 
        : baseTopic.title;
        
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;

      const image = images[Math.floor(Math.random() * images.length)];
      const content = generateContent();

      generatedArticles.push({
        title,
        slug,
        category: baseTopic.category,
        coverImage: image,
        tags: baseTopic.tags,
        content,
        isPublished: true,
        authorId: dummyAuthorId,
        // Randomize created date over the last 30 days
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });
    }

    // Insert all at once
    await Article.insertMany(generatedArticles);

    console.log('Successfully seeded 100 articles!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding articles:', error);
    process.exit(1);
  }
};

seed100Articles();
