const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Article = require('./modules/article/article.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const articles = [
  {
    title: 'Top 10 Superfoods for 6-Month-Old Babies',
    category: 'Nutrition',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['superfood', 'health', 'diet'],
    content: `
      <h2>Why Superfoods Matter</h2>
      <p>Introducing solid foods is a major milestone for your baby. Superfoods are packed with essential nutrients that support physical and cognitive development.</p>
      <br/>
      <h3>1. Avocados</h3>
      <p>Rich in healthy fats, avocados are crucial for brain development. They have a smooth texture that's easy for babies to digest.</p>
      <h3>2. Sweet Potatoes</h3>
      <p>Packed with vitamins A and C, sweet potatoes have a naturally sweet taste that most babies love.</p>
      <h3>3. Bananas</h3>
      <p>A great source of potassium, bananas provide quick energy and are perfect for on-the-go snacking.</p>
    `,
    isPublished: true,
  },
  {
    title: 'Understanding Baby Sleep Cycles',
    category: 'Health & Wellness',
    coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['sleep', 'wellness', 'parenting'],
    content: `
      <h2>The Importance of Sleep</h2>
      <p>Sleep is when your baby's brain processes the day's experiences and grows. Understanding their sleep cycles can help you establish a better routine.</p>
      <br/>
      <h3>Active vs. Quiet Sleep</h3>
      <p>Babies spend more time in REM (active) sleep than adults. This is why they might twitch, smile, or make noises while sleeping.</p>
      <h3>Establishing a Routine</h3>
      <p>Consistency is key. A predictable bedtime routine signals to your baby that it's time to wind down.</p>
    `,
    isPublished: true,
  },
  {
    title: 'Milestones: When Will My Baby Walk?',
    category: 'Milestones',
    coverImage: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['development', 'walking', 'milestones'],
    content: `
      <h2>The Journey to First Steps</h2>
      <p>Every baby develops at their own pace, but most babies take their first steps between 9 and 15 months.</p>
      <br/>
      <h3>Signs They Are Getting Ready</h3>
      <ul>
        <li>Pulling up to stand</li>
        <li>Cruising along furniture</li>
        <li>Standing without support for a few seconds</li>
      </ul>
      <h3>How to Encourage Walking</h3>
      <p>Provide a safe space for them to explore. Barefoot is best indoors, as it helps them grip the floor and develop balance.</p>
    `,
    isPublished: true,
  },
  {
    title: 'Dealing with Teething Pains',
    category: 'Health & Wellness',
    coverImage: 'https://images.unsplash.com/photo-1510018572596-a4082103ef85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['teething', 'health', 'remedies'],
    content: `
      <h2>Spotting the Signs of Teething</h2>
      <p>Teething can be a tough time for both baby and parents. Look out for drooling, chewing on solid objects, and increased fussiness.</p>
      <br/>
      <h3>Soothing Strategies</h3>
      <p>A cold teething ring or a clean, wet washcloth chilled in the fridge can provide immense relief for sore gums.</p>
      <h3>When to Consult a Doctor</h3>
      <p>If teething is accompanied by a high fever (above 101°F) or severe diarrhea, it's best to consult your pediatrician.</p>
    `,
    isPublished: true,
  }
];

const seedArticles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moncradel';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected. Emptying existing articles...');
    await Article.deleteMany();

    console.log('Inserting seed articles...');
    // Create a dummy ObjectId for authorId
    const dummyAuthorId = new mongoose.Types.ObjectId();
    
    for (const articleData of articles) {
      const article = new Article({ ...articleData, authorId: dummyAuthorId });
      await article.save();
    }

    console.log('Successfully seeded articles!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding articles:', error);
    process.exit(1);
  }
};

seedArticles();
