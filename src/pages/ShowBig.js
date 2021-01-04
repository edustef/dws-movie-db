import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import TrailerModal from '../components/TrailerModal';

export default function ShowBig({ showId, config }) {
  const [show, setShow] = useState(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);

  const bgStyle = useSpring({
    opacity: isBgLoaded ? 1 : 0,
    config: {
      duration: 1000,
      delay: 300,
    },
  });

  const posterStyle = useSpring({
    opacity: isPosterLoaded ? 1 : 0,
    transform: isPosterLoaded ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
    config: {
      mass: 2,
      tension: 80,
    },
  });

  const textStyle = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-20px, 0)' },
    to: { opacity: 1, transform: 'transalte3d(0,0, 0)' },
    config: {
      mass: 2,
      tension: 80,
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) {
        try {
          const res = await axios.get('/api/tvDetails', {
            params: {
              showId: showId,
            },
          });
          setShow(res.data);
          console.log(res.data);
          setIsTrailer(res.data.trailers.length > 0 ? true : false);
        } catch (e) {
          console.log(e);
        }
      }

      return () => {
        isMounted = false;
      };
    };

    fetchData();
  }, [showId]);

  let history = useHistory();
  return (
    <div className='bg-gray-900 w-full h-full overflow-y-auto'>
      {show ? (
        <div className='w-full relative h-full'>
          <div className='w-full z-10 absolute p-8'>
            <button
              className='flex items-center font-semibold mb-8 bg-gray-50 border hover:bg-gray-200 shadow-md py-1 px-2 rounded-md'
              onClick={() => history.goBack()}
            >
              <svg
                className='w-6 h-6 mr-1'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z'
                />
              </svg>
              Go Back
            </button>
            <div className='flex items-start flex-wrap space-x-8 relative'>
              <animated.img
                onLoad={() => setIsPosterLoaded(true)}
                style={posterStyle}
                className='opacity-0 object-cover'
                src={
                  config.base_url +
                  config.poster_sizes[3] +
                  '/' +
                  show.poster_path
                }
                alt=''
              />
              <animated.div
                style={textStyle}
                className='text-white max-w-lg opacity-0'
              >
                <div className='flex justify-between mb-8'>
                  <div className='mr-8'>
                    <div className='text-4xl font-bold mb-1'>{show.name}</div>
                    <div className='text-sm tracking-wider text-gray-300 italic'>
                      First Aired:{' '}
                      {new Date(show.first_air_date).toLocaleDateString(
                        'en-US',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='flex text-right text-3xl font-semibold'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='w-16 h-16 mr-2'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                        />
                      </svg>
                      <div>
                        {show.vote_average}/10
                        <div className='text-sm'>{show.vote_count} votes</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className='tracking-widest leading-relaxed'>
                  {show.overview}
                </p>
                <div className='flex flex-wrap mt-2'>
                  {show.genres.map(genre => (
                    <div
                      key={genre.id}
                      className='border border-white rounded-full ml-0 m-2 px-3 py-1'
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
                {isTrailer ? (
                  <button
                    className='mt-4 uppercase font-semibold hover:text-gray-300 flex space-x-2 items-center'
                    onClick={() => setIsModal(true)}
                  >
                    <span>See Trailer</span>
                    <svg
                      className='w-8 h-8'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </button>
                ) : null}
              </animated.div>
              <div className='flex flex-col items-center text-white flex-grow'>
                <div className='flex flex-col w-3/4'>
                  <label className='font-semibold' htmlFor='name'>
                    Name
                  </label>
                  <input
                    className='p-2'
                    name='name'
                    id='name'
                    type='text'
                    placeholder='Joe'
                  />
                  <label className='mt-4 font-semibold' htmlFor='comment'>
                    Comment
                  </label>
                  <textarea
                    className='p-2'
                    name='comment'
                    id='comment'
                    rows='4'
                    placeholder='Write something nice.'
                  ></textarea>
                  <button
                    className='mt-4 self-start p-2 bg-green-500 font-semibold hover:bg-green-600 uppercase'
                    type='submit'
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <animated.div style={bgStyle} className='overflow-hidden h-full'>
            <img
              onLoad={() => setIsBgLoaded(true)}
              className='opacity-10 object-cover w-full h-full object-center'
              src={
                config.base_url +
                config.backdrop_sizes[3] +
                '/' +
                show.backdrop_path
              }
              alt=''
            />
          </animated.div>
          {isModal ? (
            <TrailerModal
              closeModal={() => setIsModal(false)}
              urlId={show.trailers[0].key}
              name={show.trailers[0].name}
              size={show.trailers[0].size}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
